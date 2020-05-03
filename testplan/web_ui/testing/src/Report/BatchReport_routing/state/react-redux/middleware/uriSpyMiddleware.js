// @ts-nocheck
import {
  createLocation, createMemoryHistory, locationsAreEqual,
} from 'history';
import {
  CALL_HISTORY_METHOD, LOCATION_CHANGE,
} from 'connected-react-router/esm/actions';
import {
  flattenMap, queryStringToMap, reverseMap,
} from '../../../../../Common/utils';
import { batchActions } from '../batchedActions';

/** @typedef {typeof import("redux")} Redux */
/** @typedef {import("history")} History */
/** @typedef {ReturnType<History.createHashHistory>} HashHistoryType */
/** @typedef {ReturnType<History.createMemoryHistory>} MemoryHistoryType */
/** @typedef {ReturnType<History.createBrowserHistory>} BrowserHistoryType */
/** @typedef {HashHistoryType | MemoryHistoryType | BrowserHistoryType} HistoryType */
/** @typedef {Object.<QueryParam, MaybeArray<Redux.ActionCreator<any>>>} QueryToActionCreatorsObject */
/** @typedef {Map<MaybeArray<QueryParam>, MaybeArray<Redux.ActionCreator<any>>>} QueryToActionCreatorsMap */
/**
 * @typedef {object} HistoryLocationObject
 * @property {string} pathname
 * @property {string} search
 * @property {string} hash
 * @property {string} [key=undefined]
 * @property {Object.<string, any>} [state=undefined]
 */
/** @typedef {typeof _PUSH | typeof _POP | typeof _REPLACE} HistoryChangeAction */
/**
 * @template T
 * @typedef {T | T[]} MaybeArray<T>
 */
/** @typedef {string} QueryParam */

const __DEV__ = process.env.NODE_ENV !== 'production';

const _PUSH = 'PUSH';
const _POP = 'POP';
const _REPLACE = 'REPLACE';

/**
 * @param {HistoryType} histoire - your app-wide history object
 * @maram {QueryToActionCreatorsObject | QueryToActionCreatorsMap} queryToActionCreatorsMapping
 */
export default function uriSpyMiddleware(
  histoire,
  queryToActionCreatorsMapping
) {

  let queryToActionDotMap = null;
  if(queryToActionCreatorsMapping instanceof Map) {
    queryToActionDotMap = mkQueryToActionCreatorDotMap(
      queryToActionCreatorsMapping,
    );
  } else if(typeof queryToActionCreatorsMapping === 'object') {
    queryToActionDotMap = mkQueryToActionCreatorDotMap(
      new Map(Object.entries(queryToActionCreatorsMapping)),
    );
  } else {
    if(__DEV__) {
      console.log(
        'No valid queryToActionCreatorsMap passed in so URL query ' +
        'params will not trigger dispatch of any actions.',
      );
    }
  }

  const _UNKNOWN_HISTORY = 'UNKNOWN_HISTORY';
  const _HASH_HISTORY = 'HASH_HISTORY';
  const _MEMORY_HISTORY = 'MEMORY_HISTORY';
  const _BROWSER_HISTORY = 'BROWSER_HISTORY';

  /**
   * The 'history' package doesn't set the history's name or anything so
   * we need to guess the type based on the available properties.
   *
   * This is based off of:
   * - https://github.com/ReactTraining/history/blob/master/docs/GettingStarted.md
   * - https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js
   * - https://github.com/ReactTraining/history/blob/master/modules/createBrowserHistory.js
   * - https://github.com/ReactTraining/history/blob/master/modules/createMemoryHistory.js
   * @param {HistoryType} history
   * @returns {string}
   */
  function determineHistoryType(history) {
    // @ts-ignore
    const { location, index, entries, canGo } = history;
    if(location === undefined) {
      return _UNKNOWN_HISTORY;
    }
    const { pathname, search, hash, state } = location;
    if(pathname === undefined || search === undefined || hash === undefined) {
      return _UNKNOWN_HISTORY;
    }
    if(state !== undefined) {
      if(index !== undefined && entries !== undefined && canGo !== undefined) {
        return _MEMORY_HISTORY;
      }
      return _BROWSER_HISTORY;
    }
    return _MEMORY_HISTORY;
  }

  const _push = 'push';
  const _replace = 'replace';
  const _go = 'go';
  const _goBack = 'goBack';
  const _goForward = 'goForward';
  /**
   * @param {HistoryType} history
   * @param {typeof _push | typeof _replace | typeof _go | typeof _goBack | typeof _goForward} methodName
   * @returns {HistoryChangeAction}
   */
  const getHistoryActionFromMethod = (() => {
    const methodActionMappings = {
      [_HASH_HISTORY]: {
        [_push]: _PUSH,
        [_replace]: _REPLACE,
        [_go]: _POP,
        [_goBack]: _POP,
        [_goForward]: _POP,
      },
      [_MEMORY_HISTORY]: {
        [_push]: _PUSH,
        [_replace]: _REPLACE,
        [_go]: _POP,
        [_goBack]: _POP,
        [_goForward]: _POP,
      },
      [_BROWSER_HISTORY]: {
        [_push]: _PUSH,
        [_replace]: _REPLACE,
        [_go]: _POP,
        [_goBack]: _POP,
        [_goForward]: _POP,
      },
      // it turns out the correspondence is the same for all history types but
      // leaving this as-is since the create<X>History functions have a rather
      // complicated relationship with HTML5 history so seems like this could
      // change at some point...
    };
    return (_histoire, methodName) => {
      const historyType = determineHistoryType(_histoire);
      const methodActionMap = methodActionMappings[historyType];
      return methodActionMap[methodName];
    };
  })();

  const thisHistoryType = determineHistoryType(histoire);
  const pendingLocationsMap = new class extends Map {
    _base = [ [ _POP, [] ], [ _PUSH, [] ], [ _REPLACE, [] ] ];

    constructor() {
      super();
      this.clean();
    }

    clean() {
      this.clear();
      this._base.forEach(([ k, v ]) => this.set(k, v));
    }

    add(action, location) {
      if(typeof location === 'string') {
        location = createLocation(location);
      }
      this.get(action).push(location);
    }

    remove(action, location) {
      if(typeof location === 'string') {
        location = createLocation(location);
      }
      const locArr = this.get(action).push(location), tmp = [];
      while(locArr.length) {
        const loc = locArr.shift();
        if(locationsAreEqual(loc, location)) break;
        tmp.push(loc);
      }
      locArr.unshift(...tmp);
    }

    has(action, location) {
      return !!this.get(action).find(l => locationsAreEqual(l, location));
    }
  }();

  // To handle go / goBack / goForward we keep a local copy of the history in
  // memory. Note that we won't know about any history prior to this point.
  let historyMirror, historyMirrorOutOfSync = false;
  if(thisHistoryType === _MEMORY_HISTORY) {
    historyMirror = createMemoryHistory({
      initialEntries: histoire.entries,
      initialIndex: histoire.index,
    });
  } else {
    historyMirror = createMemoryHistory({
      initialEntries: [ histoire.location ],
      initialIndex: 0,
    });
  }

  function setGoActionPendingLocation(action, n) {
    historyMirrorOutOfSync = !historyMirror.canGo(n);
    if(historyMirrorOutOfSync) {
      console.warn('histoire mirror is out of sync');
    } else {
      const nextLoc = historyMirror.entries[historyMirror.index + n];
      pendingLocationsMap.add(action, nextLoc);
    }
  }

  /** Implements the Redux Middleware API @see node_modules/redux/index.d.ts:450 */
  return ({ dispatch, getState }) => {
    return (next) => {
      return (originalAction) => {
        if(queryToActionDotMap === null) {
          next(originalAction);
          return;
        }
        const { type, payload } = originalAction;
        switch(type) {
          case CALL_HISTORY_METHOD:
            // We get here when we use a connected-react-router 'routerActions'
            // method, which simply means that this location change is a
            // programmatic change instead of user-initiated.
            //
            // This will be followed by a LOCATION_CHANGE event which we'll
            // want to prevent from dispatching the same action that caused
            // us to get here (lest we end up in an infinite-dispatch loop).
            //
            // We'll prevent this by setting an entry in our
            // `pendingLocationActionMap` of what the LOCATION_CHANGE action's
            // payload will be so - when we receive that payload - we know not
            // to re-dispatch the action that got us here in the first place.
            //
            // Now we have the challenge of knowing what the 'history'
            // package's subsequent history-changing "action" will be:
            // "POP" or "REPLACE" or "PUSH". These are mentioned in one
            // tiny sentence in the very terse 'history' docs here:
            // https://github.com/ReactTraining/history/blob/master/docs/GettingStarted.md#listening
            //
            // To summarize where we are at this point:
            // - We have programmatically dispatched an action using one of
            //   the 'connected-react-router'-versions of these methods: "go",
            //   "goBack", "goForward", "push", "replace". See also:
            //   - node_modules/connected-react-router/esm/actions.js:47
            //   - https://github.com/ReactTraining/history/blob/master/docs/Navigation.md
            // - We need to predict which of
            //   "POP" / "REPLACE" / "PUSH"
            //   will be used by react-router in response to our call of
            //   "go" / "goBack" / "goForward" / "push" / "replace"
            //
            // The challenge is that the corresponce from
            // "go" / "goBack" / "goForward" / "push" / "replace"
            // to
            // "POP" / "REPLACE" / "PUSH"
            // depends on the type of history we're using (hash / browser /
            // memory).
            //
            // Note that this can only be used determinitively as-implemented
            // if there is no block listener on the history, since that can
            // change the eventual POP / REPLACE / PUSH after we leave here,
            // i.e. the history wasn't created with a 'getUserConfirmation'
            // function.
            // https://github.com/ReactTraining/history/blob/master/docs/Blocking.md
            const { method, args } = payload;
            const historyAction = getHistoryActionFromMethod(method);
            switch(method) {
              case _go:
                setGoActionPendingLocation(historyAction, args);
                break;
              case _goBack:
                setGoActionPendingLocation(historyAction, -1);
                break;
              case _goForward:
                setGoActionPendingLocation(historyAction, 1);
                break;
              case _push:
              case _replace:
                pendingLocationsMap.add(historyAction, args);
                break;
              default:
                console.warn(`Unknown method "${method}"`);
            }
            next(originalAction);
            break;
          case LOCATION_CHANGE:
            // At this point we don't know whether this location change was
            // initiated by the user or us, so we check pendingLocationsMap to
            // see if we're expecting this location to result from a
            // programmatic navigation
            const { location, isFirstRendering, action: _action } = payload;
            if(isFirstRendering) {
              pendingLocationsMap.clean();
            } else if(pendingLocationsMap.has(_action, location)) {
              pendingLocationsMap.remove(_action, location);
            } else {
              const queryParamMap = queryStringToMap(location.search);
              const additionalActions = [];
              for(const [ param, val ] of queryParamMap) {
                const acFunc = queryToActionDotMap.query.to.actions.get(param);
                if(acFunc) additionalActions.push(acFunc(val));
              }
              if(additionalActions.length) {
                next(batchActions({
                  originalAction,
                  additionalActions,
                  next,
                }));
                break;
              }
            }
            next(originalAction);
            break;
          default:
            next(originalAction);
            break;
        }
      };
    };
  };
}

/** @param {QueryToActionCreatorsMap} queryToActionsMap */
const mkQueryToActionCreatorDotMap = queryToActionsMap => {
  // we're assigning values like this since webpack's terser will remove
  // the unreachable blocks as dead code so there's no risk of any of these
  // being triggered in production
  const fat = {
      query: {
        to: {
          actions: queryToActionsMap,
        },
        from: {
          actions: reverseMap(queryToActionsMap),
        },
      },
    },
    part = {
      query: {
        to: {
          actions: flattenMap(fat.query.to.actions),
        },
        from: {
          actions: flattenMap(fat.query.from.actions, a => a.type),
        },
      },
    },
    _queryActionMap = {
      ...part,
      actions: {
        to: {
          query: part.query.from.actions,
        },
        from: {
          query: part.query.to.actions,
        },
      },
      fat: {
        ...fat,
        actions: {
          to: {
            query: fat.query.from.actions,
          },
          from: {
            query: fat.query.to.actions,
          },
        },
      },
    };
  if(__DEV__) {
    if(new Set([  // all these should be the same size
      _queryActionMap.fat.query.to.actions.size,
      _queryActionMap.fat.actions.to.query.size,
      _queryActionMap.fat.query.from.actions.size,
      _queryActionMap.fat.actions.from.query.size,
    ]).size !== 1) {
      throw new Error('The query-to-actions map is not a 1-1 mapping');
    }
  }
  return _queryActionMap;
};
