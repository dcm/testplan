/// <reference path="./createRouterComponents.d.ts" />
/**
 * @typedef {import("./createRouterComponents").ActuallyAny} ActuallyAny
 * @typedef {import("./createRouterComponents").TaggedHistory} TaggedHistory
 * @typedef {import("./createRouterComponents").TaggedLocation} TaggedLocation
 * @typedef {import("./createRouterComponents").History} History
 * @typedef {import("./createRouterComponents").Location} Location
 * @typedef {import("./createRouterComponents").URLQueryParamRegistrationConfig} URLQueryParamRegistrationConfig
 */
/**
 * @template D, A
 * @typedef {import("./createRouterComponents").QueryParamActionCreator<D, A>} QueryParamActionCreator<D, A>
 */
/**
 * @template D, A
 * @typedef {import("./createRouterComponents").HistoryRegistry<D, A>} HistoryRegistry<D, A>
 */
import React from 'react';
import { createAsyncThunk } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import * as qsStringify from 'qs/lib/stringify';
import * as qsParse from 'qs/lib/parse';
import _routerMiddleware from 'connected-react-router/esm/middleware';
import getIn from 'connected-react-router/esm/structure/plain/getIn';
import { CALL_HISTORY_METHOD } from 'connected-react-router/esm/actions';
import { LOCATION_CHANGE } from 'connected-react-router/esm/actions';
import { routerActions } from 'connected-react-router/esm/actions';
import createConnectedRouter from 'connected-react-router/esm/ConnectedRouter';
import createConnectRouter from 'connected-react-router/esm/reducer';
import createSelectors from 'connected-react-router/esm/selectors';

const CRR_MOUNT = [ 'router' ];

class QueryParams {
  static parse(queryString) {
    return qsParse(queryString, {
      ignoreQueryPrefix: true,
      allowDots: true,
      charset: 'utf-8',
      strictNullHandling: true,
    });
  }
  static stringify(obj) {
    return qsStringify(obj, {
      arrayFormat: 'repeat',
      allowDots: true,
      addQueryPrefix: true,
      strictNullHandling: true,
      sort: (s1, s2) => s1.localeCompare(s2),  // alphabetical
    });
  }
}

const mkTag = () => Math.trunc(Math.random() * 1e9).toString(36);

const DISPATCHED_TAG = mkTag();

const historyIdTag = {
  setOn: {
    /**
     * NOTE: Mutates `location`
     * @param {Location} location
     * @param {string} id
     * @returns {TaggedLocation}
     */
    location(location, id) {
      return Object.defineProperty(location, 'id', {
        value: id,
        enumerable: false,
      });
    },
    /**
     * NOTE: Mutates `history`
     * @param {History} history
     * @param {string} id
     * @returns {TaggedHistory}
     */
    history(history, id) {
      const _listen = history.listen.bind(history);
      return Object.defineProperties(history, {
        id: {
          value: id,
          enumerable: false,
        },
        listen: {
          value: listener => _listen((location, action) => {
            // replace the default location with a tagged version so the
            // listener knows which history it came from
            return listener(historyIdTag.setOn.location(location, id), action);
          }),
        },
      });
    },
  },
  getFrom: {
    history(history) {
      return history.id;
    },
    locationChangeAction(action) {
      if(typeof action !== 'object') return null;
      if(typeof action.location !== 'object') return null;
      const historyId = action.location.id;
      if(typeof historyId !== 'string') return null;
      return historyId;
    },
    callHistoryMethodAction(action) {
      if(typeof action !== 'object') return null;
      if(typeof action.meta !== 'object') return null;
      const historyId = action.meta._historyId;
      if(typeof historyId !== 'string') return null;
      return historyId;
    },
  },
};

const tagDispatched = action => {
  const taggedAction = Object.assign({}, action);
  taggedAction.meta = taggedAction.meta || {};
  taggedAction.meta._tag = DISPATCHED_TAG;
  return taggedAction;
};

const isDispatched = action => {
  return (action.meta || {})._tag === DISPATCHED_TAG;
};

const mkTaggedRouterActions = historyId => Object.fromEntries(
  Object.entries(routerActions).map(([name, origActionCreator]) => [
    name,
    arg => {
      const action = origActionCreator(arg);
      action.meta = action.meta || {};
      action.meta._historyId = historyId;
      return action;
    }
  ])
);

const mkImmerStructure = mountPath => ({
  fromJS: val => val,
  toJS: val => val,
  merge: (state, payload = {}) => {
    Object.assign(state, payload);
  },
  getIn: (state, path = []) => getIn(
    state,
    path[0] === CRR_MOUNT[0]
      ? mountPath.concat(path.slice(1))
      : path
  ),
});

/** @type {HistoryRegistry<ActuallyAny, ActuallyAny>} */
class Registry {
  static config = {
    programmatic: {},
    external: {},
  };
  static histories = {};
  /**
   * @param {History} history
   * @param {string[]} mountPath
   * @param {URLQueryParamRegistrationConfig} queryParamConfig
   */
  static register(history, mountPath, queryParamConfig) {
    let historyId = historyIdTag.getFrom.history(history);
    if(!historyId) {
      historyId = mkTag();
      historyIdTag.setOn.history(history, historyId);
      Registry.histories[historyId] = {
        history: history,
        pending: [],
        selectors: undefined,
        actions: undefined,
        structure: undefined,
      };
    }
    const registration = Registry.histories[historyId];
    registration.actions = mkTaggedRouterActions(historyId);
    registration.structure = mkImmerStructure(mountPath);
    registration.selectors = createSelectors(registration.structure);
    for(const [queryParam, actionCreator] of Object.entries(queryParamConfig)) {
      const { type: actionType } = actionCreator();
      Registry.config.programmatic[actionType] = { queryParam, historyId };
      Registry.config.external[queryParam] = { actionCreator, historyId };
    }
  }
}

const queryParamChangeActions = {
  external: createAsyncThunk(
    'URLQueryParamWatcher/EXTERNAL_CHANGE',
    async (locationChangeAction, thunkAPI) => {
      const { location } = locationChangeAction.payload;
      // we get the history ID we attached in our history.listener monkeypatch
      const historyId = location.id;
      const historyCfg = Registry.histories[historyId];
      const pendingPos = historyCfg.pending.indexOf(location.search);
      if(pendingPos !== -1) {
        // getting here means we're at the conclusion of a dispatch started
        // in `programmaticURLChangeAction`
        historyCfg.pending.splice(pendingPos, 1);
      } else {
        // getting here means we're at the start of an externally-initiated
        // location change, and since we've intercepted the change in the
        // middleware the location in our state is old by 1
        const oldSearch = historyCfg.selectors.getSearch(thunkAPI.getState());
        const newSearch = location.search;
        if(oldSearch !== newSearch) {
          // at this point we know some query param has changed but we don't
          // know what
          const oldSearchParsed = QueryParams.parse(oldSearch);
          const newSearchParsed = QueryParams.parse(newSearch);
          for(const [param, val] of Object.entries(newSearchParsed)) {
            // find params that are either:
            // - In the new query params that weren't in the old one
            // - Are in the new and old query params that have changed
            if(oldSearchParsed[param] !== val) {
              const queryParamConfig = Registry.config.external[param];
              if(queryParamConfig) {
                const { actionCreator } = queryParamConfig;
                const taggedAction = tagDispatched(actionCreator(val));
                await new Promise(resolve => {
                  thunkAPI.dispatch(taggedAction);
                  resolve();
                });
              }
            }
            delete oldSearchParsed[param];
          }
          // since we've been deleting from `stateSearchParsed`, if it has any
          // params that aren't in `newSearchParsed`, we iterate through those
          for(const param of Object.keys(oldSearchParsed)) {
            const queryParamConfig = Registry.config.external[param];
            if(queryParamConfig) {
              const { actionCreator } = queryParamConfig;
              const taggedAction = tagDispatched(actionCreator());
              await new Promise(resolve => {
                thunkAPI.dispatch(taggedAction);
                resolve();
              });
            }
          }
        }
      }
    }
  ),
  programmatic: createAsyncThunk(
    'URLQueryParamWatcher/PROGRAMMATIC_CHANGE',
    async (originalAction, { getState, dispatch }) => {
      // if we get here then we've registered a query param that should be
      // set whenever this `originalAction` is dispatched

      // dispatch the original action with a tag so the middleware doesn't
      // send us back here
      const taggedOrigAction = tagDispatched(originalAction);
      await new Promise(resolve => {
        dispatch(taggedOrigAction);
        resolve();
      });

      // determine the new location by combining the query params of the
      // current location with the query param we've registered for this
      // action, using this action's payload as the the query param's value
      const programmaticCfg = Registry.config.programmatic[
        taggedOrigAction.type
      ];
      const historyCfg = Registry.histories[
        programmaticCfg.historyId
      ];
      const stateLocation = historyCfg.selectors.getLocation(getState());
      const currSearchParsed = QueryParams.parse(stateLocation.search);
      currSearchParsed[programmaticCfg.queryParam] = taggedOrigAction.payload;
      const newSearch = QueryParams.stringify(currSearchParsed);
      historyCfg.pending.push(newSearch);
      const newLocation = Object.assign({}, stateLocation, {
        search: newSearch
      });
      await new Promise(resolve => {
        // this will dispatch a tagged 'type = CALL_HISTORY_METHOD' action
        const taggedPush = tagDispatched(historyCfg.actions.push(newLocation));
        dispatch(taggedPush);
        resolve();
      });
    }
  ),
};

export const routerMiddleware = store => next => action => {
  if(!isDispatched(action)) {
    if(action.type === LOCATION_CHANGE) {
      if(historyIdTag.getFrom.locationChangeAction(action)) {
        return store.dispatch(queryParamChangeActions.external(action));
      }
    } else if(action.type in Registry.config.programmatic) {
      return store.dispatch(queryParamChangeActions.programmatic(action));
    } else if(action.type === CALL_HISTORY_METHOD) {
      const historyId = historyIdTag.getFrom.callHistoryMethodAction(action);
      if(historyId) {
        const { history } = Registry.histories[historyId];
        return _routerMiddleware(history)(store)(next)(action);
      }
    }
  }
  return next(action);
};

/**
 * @param {History} history
 * @param {string[]} mountPath
 * @param {URLQueryParamRegistrationConfig} queryParamConfig
 */
export function createRouterComponents(history, mountPath, queryParamConfig) {
  Registry.register(history, mountPath, queryParamConfig);
  const { selectors, structure, actions } = Registry.histories[history.id];
  const ConnectedRouter = createConnectedRouter(structure);
  const routerReducer = createConnectRouter(structure)(history);
  return {
    selectors,
    structure,
    actions,
    Router: props => (<ConnectedRouter history={history} {...props} />),
    reducer: (state, action) => {
      if(action.type === LOCATION_CHANGE) {
        const historyId = historyIdTag.getFrom.locationChangeAction(action);
        if(historyId && action.payload.location.id === historyId) {
          return routerReducer(state, action);
        }
      }
      return state;
    }
  };
}

export default createRouterComponents;
