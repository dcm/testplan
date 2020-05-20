import React from 'react';
import { createAsyncThunk } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import * as qsStringify from 'qs/lib/stringify';
import * as qsParse from 'qs/lib/parse';
import routerMiddleware from 'connected-react-router/esm/middleware';
import getIn from 'connected-react-router/esm/structure/plain/getIn';
import { CALL_HISTORY_METHOD } from 'connected-react-router/esm/actions';
import { LOCATION_CHANGE } from 'connected-react-router/esm/actions';
import { onLocationChanged } from 'connected-react-router/esm/actions';
import { routerActions } from 'connected-react-router/esm/actions';
import createConnectedRouter from 'connected-react-router/esm/ConnectedRouter';
import createConnectRouter from 'connected-react-router/esm/reducer';

const __DEV__ = 'production' !== process.env.NODE_ENV;

/** @typedef {any |string |number |boolean |null |symbol |BigInt} ActuallyAny */
/** @typedef {import("history").History} History */
/** @typedef {History & { id: string,  }} TaggedHistory */
/** @typedef {import("@reduxjs/toolkit").CreateSliceOptions} CreateSliceOptions */
/** @typedef {import("@reduxjs/toolkit").Reducer} Reducer */
/**
 * @callback ValidateQueryParamCallback
 * @param {string} param
 * @param {ActuallyAny} value
 * @param {boolean} fromURL - `true` if `value` has been passed in from the URL
 * @returns {boolean} - whether `value` passes validation
 */
/**
 * @callback ConvertQueryParamCallback
 * @param {string} param
 * @param {ActuallyAny} value
 * @param {boolean} fromURL - `true` if `value` has been passed in from the URL
 * @returns {ActuallyAny}
 */
/**
 * A list of query param strings for which we'll produce generic state-setter
 * reducers for e.g. an element "myParam" on slice "mySlice" produces:
 * `(state, action) => { state.mySlice.myParam = action.payload; }`
 * @typedef {Array<string | RegExp>} WatchedQueryParamsArrayConfig
 */
/**
 * @typedef {object} WatchConfigObj
 * @property {Reducer} reducer
 * @property {ValidateQueryParamCallback} [validate=undefined]
 * @property {ConvertQueryParamCallback} [convert=undefined]
 */
/** @typedef {Object.<string, Reducer>} WatchConfigFunc */
/** @typedef {WatchConfigObj | WatchConfigFunc} WatchConfig */
/**
 * Mapping of string query param keys to WatchConfig
 * @typedef {Object.<string, WatchConfig>} WatchedQueryParamsObjectConfig
 */
/**
 * Map of strings or regular expressions (which are matched against query
 * param keys) to WatchConfig's.
 * @typedef {Map<string | RegExp, WatchConfig>} WatchedQueryParamsMapConfig
 */
/**
 * @typedef WatchedQueryParamConfig
 * @type {WatchedQueryParamsArrayConfig | WatchedQueryParamsObjectConfig |
 *   WatchedQueryParamsMapConfig}
 */
/**
 * @typedef {object} HistoryRegistryItem
 * @property {Set<string>} registered
 * @property {Object.<string, function(ActuallyAny): boolean>} validators
 * @property {Object.<string, function(ActuallyAny): ActuallyAny>} converters
 * @property {Object.<string, function(): void>} unlisteners
 * @property {AbortSignal | null} abort
 * @property {Object.<string, ActuallyAny>} current
 */
/**
 * @typedef {CreateSliceOptions} CreateSliceWithRouterOptions
 * @property
 */

const parseQueryString = queryString => qsParse(queryString, {
  ignoreQueryPrefix: true,
  allowDots: true,
  charset: 'utf-8',
  strictNullHandling: true,
});
const stringifyQueryParams = obj => qsStringify(obj, {
  arrayFormat: 'repeat',
  allowDots: true,
  addQueryPrefix: true,
  strictNullHandling: true,
  sort: (s1, s2) => s1.localeCompare(s2),  // alphabetical
});

const CRR_MOUNT = [ 'router' ];
const mkCRRStructure = (mount = CRR_MOUNT) => ({
  fromJS: val => val,
  toJS: val => val,
  merge(state, payload = {}) { Object.assign(state, payload); },
  getIn: (state, path = []) => getIn(
    state, path[0] === CRR_MOUNT[0] ? mount.concat(path.slice(1)) : path
  )
});

/** @param {TaggedHistory} taggedHistory */
const mkCRRMiddleware = taggedHistory => store => next => action =>
  (action.type === CALL_HISTORY_METHOD) && (action.meta.id === taggedHistory.id)
    ? routerMiddleware(taggedHistory)(store)(next)(action)
    : next(action);

const mkCRR = (structure, taggedHistory) => {
  const ConnectedRouter = createConnectedRouter(structure);
  return props => (<ConnectedRouter history={taggedHistory} {...props} />);
};


export default (param, hist, validate , convert ) => {
  return createAsyncThunk(
    `URL_QUERY_PARAM:${param}`,
    async (arg, { dispatch, getState, requestID, signal, rejectWithValue }) => {
      try {

      } catch(err) {

      }
    },

  );
};

const wrapAction = (id, action) => args => Object.assign(action(args), {
  meta: { id }
});

/** @param {History & TaggedHistory} histoire */
const tagHistory = histoire => {
  const _listen = histoire.listen.bind(histoire);
  Object.defineProperties(histoire, {
    id: {
      value: Math.trunc(Math.random() * 1e9).toString(36),
      enumerable: false,
    },
    listen: {
      value: listener => _listen((location, action) => listener(
        Object.defineProperty(location, 'id', {
          value: histoire.id,
          enumerable: false,
        }),
        action
      )),
    },
  });
};

const mkCRRouterReducer = (structure, taggedHistory) => {
  const routerReducer = createConnectRouter(structure)(taggedHistory);
  return (state, action) => {
    if(action.type === LOCATION_CHANGE) {
      if(action.payload.location.id === taggedHistory.id) {
        return routerReducer(state, action);
      }
    }
  };
};

/** @type {WeakMap<TaggedHistory, HistoryRegistryItem>} */
const queryParamRegistry = new WeakMap();
/** @type {function(): HistoryRegistryItem} */
const mkEmptyQueryParamConfig = () => ({
  registered: new Set(),
  validators: {},
  converters: {},
  unlisteners: {},
  current: {},
  abort: null,
});

/**
 * @param {TaggedHistory} histoire
 * @param {object} queryParamConfig
 */
const registerQueryParamHandlers = (histoire, queryParamConfig) => {

  let config = queryParamRegistry.get(histoire);
  if(!config) {
    config = mkEmptyQueryParamConfig();
    queryParamRegistry.set(histoire, config);
  }

  const queryParamEntries = [];
  if(queryParamConfig instanceof Map) {
    queryParamEntries.push(...Array.from(queryParamConfig));
  } else if(queryParamConfig && typeof queryParamConfig === 'object') {
    queryParamEntries.push(...Object.entries(queryParamConfig));
  } else {
    if(__DEV__) {
      throw new Error('`queryParamConfig` should be an object or Map');
    } else {
      console.warn(
        'Invalid query param config - not configuring query param handling'
      );
    }
    return;
  }

  const queryParamConfigMap = new Map();
  for(const [param, config] of queryParamEntries) {

    const resolvedConfig = { validate: () => true, convert: val => val };
    if(typeof config === 'function') {
      Object.assign(resolvedConfig, { reducer: config });
    } else if(typeof config === 'object' && config !== null) {
      // @ts-ignore
      const { reducer, validate, convert } = config;
      if(typeof reducer !== 'function') {
        if(__DEV__) throw new Error(
          `The '${param}' config object must have a named "reducer" function`
        );
        continue;
      }
      Object.assign(resolvedConfig, { reducer, validate, convert });
    } else {
      if(__DEV__) throw new Error(`The config for '${param}' is wrong.`);
      continue;
    }

    if(param instanceof RegExp) {
      queryParamConfigMap.set(param, resolvedConfig);
    } else if(typeof param === 'string') {
      queryParamConfigMap.set(RegExp(`^${param}$`), resolvedConfig);
    } else {
      if(__DEV__) throw new Error(
        `Got param of type '${typeof param}', expected string or RegExp.`
      );
      continue;
    }


  }

};

/**
 * @param {object} props
 * @param {string} props.mount - the slice MUST be
 *    mounted on the top-level of the store's state at a same-named key
 * @param {History & TaggedHistory} props.history
 * @param {WatchedQueryParamConfig} props.queryParams
 */
const createRouterSlice = ({ mount, history, queryParams = {} }) => {
  const mountPath = Array.isArray(mount) ? mount : [mount];
  tagHistory(history);
  const structure = mkCRRStructure(mountPath);
  let registryVal = registry.get(hist);
  if(!registryVal) {
    registryVal = REGISTRY_ITEM_INIT;
  }
  registry.set(hist, Object.assign(registryVal, {
    registered: registryVal.registered.concat(param),
    validators: { [param]: validate },
    converters: { [param]: convert },
    unlisteners: {
      [param]: (() => {

        return hist.listen((location, action) => {

        });
      })(),
    },
    current: {
      [param]: undefined,
    },
  }));


  const wrappedRouterActions = Object.fromEntries(
    Object.entries(routerActions).map(
      ([name, func]) => [ name, wrapAction(history.id, func) ]
    )
  );
  return {
    id: history.id,
    middleware: mkCRRMiddleware(history),
    actions: {
      ...wrappedRouterActions,
    },
    reducer: mkCRRouterReducer(structure, history),
    Router: mkCRR(structure, history),
  };
};
