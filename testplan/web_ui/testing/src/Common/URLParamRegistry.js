import * as _qsStringify from 'qs/lib/stringify';
import * as _qsParse from 'qs/lib/parse';
import _difference from 'lodash/difference';
import _intersection from 'lodash/intersection';
import _isEqual from 'lodash/isEqual';
import _cloneDeep from 'lodash/cloneDeep';

const __DEV__ = process.env.NODE_ENV !== 'production';

const qsParse = queryString => _qsParse(queryString, {
  ignoreQueryPrefix: true,
  allowDots: true,
  charset: 'utf-8',
  strictNullHandling: true,
});

const qsStringify = obj => _qsStringify(obj, {
  arrayFormat: 'repeat',
  allowDots: true,
  addQueryPrefix: true,
  strictNullHandling: true,
  sort: (s1, s2) => s1.localeCompare(s2),  // alphabetical
});

const isArray = Array.isArray;
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const defineProperty = Object.defineProperty.bind(Object);

export default class URLParamRegistry {

  _prevSearchString = '';
  _prevSearchObj = {};
  _prevSearchKeys = [];
  _unlistenHistory = null;
  /** @type {{ [queryParam: string]: { defaultVal: any; actionCreators: Array<function>; }}} */
  _param2ActionCreatorsMap = {};
  /** @type {{ [actionType: string]: { defaultVal: any; params: string[]; }}} */
  _actionType2ParamsMap = {};

  _actionInterceptor(action) {
    const { defaultVal, params } = this._actionType2ParamsMap[action.type];
    if(isArray(params) && params.length > 0) {
      const currLocation = this._history.location;
      const currSearchString = currLocation.search;
      const currSearchObj = qsParse(currSearchString);
      const newSearchObj = _cloneDeep(currSearchObj);
      for(const param of params) {
        if(action.payload === defaultVal) {
          delete newSearchObj[param];
        } else {
          newSearchObj[param] = action.payload;
        }
      }
      if(!_isEqual(newSearchObj, currSearchObj)) {
        const newLocation = {
          ...currLocation,
          search: qsStringify(newSearchObj),
        };
        this._history.push(newLocation, undefined, this._history.length);
      }
    }
  }

  _createHistoryListener(store) {
    return (location, action, programmaticPushLength) => {
      const wasProgrammaticPush = (
        action === 'PUSH' &&
        typeof programmaticPushLength === 'number' &&
        this._history.length === (programmaticPushLength + 1)
      );
      if(!wasProgrammaticPush) {
        if(this._unlistenHistory && location.search !==
           this._prevSearchString) {
          const searchObj = qsParse(location.search);
          const searchKeys = Object.keys(searchObj);
          const addedKeys = _difference(searchKeys, this._prevSearchKeys);
          for(const newKey of addedKeys) {
            const { actionCreators } = this._param2ActionCreatorsMap[newKey];
            if(actionCreators) {
              const payloadVal = searchObj[newKey];
              for(const ac of actionCreators) {
                store.dispatch(ac(payloadVal));
              }
            }
          }
          const removedKeys = _difference(this._prevSearchKeys, searchKeys);
          for(const oldKey of removedKeys) {
            const {
              defaultVal, actionCreators
            } = this._param2ActionCreatorsMap[oldKey];
            if(actionCreators) {
              for(const ac of actionCreators) {
                store.dispatch(ac(defaultVal));
              }
            }
          }
          const commonKeys = _intersection(searchKeys, this._prevSearchKeys);
          for(const key of commonKeys) {
            const newVal = searchObj[key];
            const oldVal = this._prevSearchObj[key];
            if(!_isEqual(newVal, oldVal)) {
              const { actionCreators } = this._param2ActionCreatorsMap[key];
              if(actionCreators) {
                for(const actionCreator of actionCreators) {
                  store.dispatch(actionCreator(newVal));
                }
              }
            }
          }
          this._prevSearchString = location.search;
          this._prevSearchObj = searchObj;
          this._prevSearchKeys = searchKeys;
        }
      }
    };
  }

  static _tagHistory(history) {
    const oldPush = history.push.bind(history);
    function newPush(path, state, programmaticPushLength) {
      this._programmaticPushLength = programmaticPushLength;
      return oldPush(path, state);
    }
    const pushDescriptor = getOwnPropertyDescriptor(history, 'push');
    defineProperty(history, 'push', {
      ...pushDescriptor,
      value: newPush.bind(history),
    });
    const oldListen = history.listen.bind(history);
    function newListen(listener) {
      return oldListen((location, action) => {
        const res = listener(
          location,
          action,
          this._programmaticPushLength,
        );
        this._programmaticPushLength = undefined;
        return res;
      });
    }
    const _listenDescriptor = getOwnPropertyDescriptor(history, 'listen');
    defineProperty(history, 'listen', {
      ..._listenDescriptor,
      value: newListen.bind(history),
    });
    return history;
  }

  constructor(history) {
    this._history = URLParamRegistry._tagHistory(history);
  }

  /**
   * Adds a listener that dispatches the passed action creator whenever
   * the passed URL query param changes. The value of the query param
   * is passed as an argument to the action creator.
   * @param {string} queryParam
   * @param {function} actionCreator
   */
  registerQueryParamListener(queryParam, actionCreator) {
    const typeofQueryParam = typeof queryParam;
    const typeofActionCreator = typeof actionCreator;
    if(typeofQueryParam === 'string' && typeofActionCreator === 'function') {
      const defaultVal = actionCreator().payload;
      let currACObj = this._param2ActionCreatorsMap[queryParam];
      if(!currACObj) {
        this._param2ActionCreatorsMap[queryParam] = {
          defaultVal,
          actionCreators: [],
        };
        currACObj = this._param2ActionCreatorsMap[queryParam];
      }
      const currACSet = new Set(currACObj.actionCreators);
      if(!currACSet.has(actionCreator)) {
        currACObj.actionCreators.push(actionCreator);
      }
    } else if(__DEV__) {
      throw new Error(
        'Expected (<string>, <function>), received ' +
        `(<${typeofQueryParam}>, <${typeofActionCreator}>).`
      );
    }
    return this;
  }

  /**
   * Adds a listener that sets the URL query param to the payload value of
   * dispatced action
   * @param {string} queryParam
   * @param {function} actionCreator
   */
  registerActionListener(queryParam, actionCreator) {
    const typeofQueryParam = typeof queryParam;
    const typeofActionCreator = typeof actionCreator;
    if(typeofQueryParam === 'string' && typeofActionCreator === 'function') {
      const { type: actionType, payload: defaultVal } = actionCreator();
      const typeofActionType = typeof actionType;
      if(typeofActionType === 'string') {
        let currParamsObj = this._actionType2ParamsMap[actionType];
        if(!currParamsObj) {
          this._actionType2ParamsMap[actionType] = {
            defaultVal,
            params: [],
          };
          currParamsObj = this._actionType2ParamsMap[actionType];
        }
        if(!(queryParam in currParamsObj.params)) {
          currParamsObj.params.push(queryParam);
        }
      } else if(__DEV__) {
        throw new Error(
          'Expected `actionCreator().type` to be type <string>, ' +
          `instead got type <${typeofActionType}>.`
        );
      }
    } else if(__DEV__) {
      throw new Error(
        'Expected (<string>, <function>), received ' +
        `(<${typeofQueryParam}>, <${typeofActionCreator}>).`
      );
    }
    return this;
  }

  /**
   * @param {string} queryParam
   * @param {function} actionCreator
   */
  registerBidirectionalListener(queryParam, actionCreator) {
    const typeofQueryParam = typeof queryParam;
    const typeofActionCreator = typeof actionCreator;
    if(typeofQueryParam === 'string' && typeofActionCreator === 'function') {
      this.registerActionListener(queryParam, actionCreator);
      this.registerQueryParamListener(queryParam, actionCreator);
    } else if(__DEV__) {
      throw new Error(
        'Expected (<string>, <function>), received ' +
        `(<${typeofQueryParam}>, <${typeofActionCreator}>).`
      );
    }
    return this;
  }

  /**
   * This should creates the middleware that should be passed to the store
   * creator.
   */
  createMiddleware() {
    return store => {
      this._unlistenHistory = this._history.listen(
        this._createHistoryListener(store)
      );
      return next => {
        return action => {
          this._actionInterceptor(action);
          next(action);
        };
      };
    };
  }
}
