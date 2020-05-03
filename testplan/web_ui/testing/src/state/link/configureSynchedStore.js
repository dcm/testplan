/// <reference path="./configureSynchedStore.d.ts" />
// @ts-nocheck
import { createAction } from '@reduxjs/toolkit';
import { createDraft, isDraft, isDraftable } from 'immer';
import React from 'react';
import routerMiddleware from 'connected-react-router/esm/middleware';
import createConnectRouter from 'connected-react-router/esm/reducer';
import { CALL_HISTORY_METHOD } from 'connected-react-router/esm/actions';
import { LOCATION_CHANGE } from 'connected-react-router/esm/actions';
import createConnectedRouter from 'connected-react-router/esm/ConnectedRouter';
import createSelectors from 'connected-react-router/esm/selectors';
import plainStructure from 'connected-react-router/esm/structure/plain';
import { combineReducers } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { compose, nanoid } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { createStore } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { applyMiddleware } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { configureStore } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { createSelector } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { createReducer } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { getDefaultMiddleware } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import connect, { createConnect } from 'react-redux/es/connect/connect';
import Provider from 'react-redux/es/components/Provider';
import { applyPatches, produceWithPatches } from 'immer/dist/immer.esm';
import { original, produce, finishDraft } from 'immer/dist/immer.esm';
import _memoize from 'lodash/memoize';
import _clone from 'lodash/clone';
import _get from 'lodash/get';
import _set from 'lodash/set';
import _cloneDeepWith from 'lodash/cloneDeepWith';
import _merge from 'lodash/merge';
import _omit from 'lodash/omit';
import immerStructure from '../struct/immerStructure';

/** @typedef {import("@reduxjs/toolkit").Slice} Slice */
/** @typedef {typeof import("redux")} Redux */
/**
 * @template T, U
 * @typedef {import("redux").StoreEnhancer<T, U>} StoreEnhancer<T, U>
 */
/**
 * @template T, U
 * @typedef {import("redux").StoreEnhancerStoreCreator<T, U>}
 *   StoreEnhancerStoreCreator<T, U>
 */
/**
 * @template T
 * @typedef {import("redux").PreloadedState<T>} PreloadedState<T>
 */
/**
 * @template T
 * @typedef {import("immer").Draft<T>} Draft<T>
 */
/**
 * @template T
 * @typedef {import("redux").Reducer<T>} Reducer<T> */
/** @typedef {import("redux").ActionCreator} ActionCreator */
/**
 * @template T
 * @typedef {import("redux").Action<T>} Action<T>
 */
/** @typedef {import("redux").AnyAction} AnyAction */
/**
 * @template S, A
 * @typedef {import("redux").Store<S, A>} Store<S, A>
 */
/** @typedef {import("redux").ReducersMapObject} ReducersMapObject */
/** @typedef {import("@reduxjs/toolkit").EnhancedStore} EnhancedStore */
/**
 * @template T
 * @typedef {import("@reduxjs/toolkit").PrepareAction<T>} PrepareAction<T>
 */
/**
 * @template T
 * @typedef {ReturnType<PrepareAction<T>>} PreparedAction<T>
 */
/** @typedef {import("redux").Unsubscribe} Unsubscribe */
/** @typedef {typeof import("history")} History */
/** @typedef {typeof import("react")} React */
/** @typedef {import("@reduxjs/toolkit").ConfigureStoreOptions} ConfigureStoreOptions */
/**
 * @typedef {object} SyncSubstateOptions
 * @property {Store} destStore
 * @property {ActionCreator} syncActionCreator -
 *    Action creator with a corresponding reducer that updates the destStore
 *   state
 * @property {Store} srcStore
 */
/**
 * @callback _addSubrouter
 * @param {AddSubrouterOptions} props
 * @returns {AddSubrouterReturnValue}
 */
/** @typedef {{ current: Store }} StoreRef */
/** @typedef {Object.<string, ReturnType<createSelector>>} Selectors */
/** @typedef {typeof import("react-redux").Provider} Provider */
/** @typedef {import("react-redux").Connect} Connect */
/** @typedef {import("react-router").Router} Router */
/** @typedef {import("react").FunctionComponent} FunctionComponent */
/**
 * @typedef {object} AddSubrouterOptions
 * @property {History} history
 * @property {string} [name="Subrouter"]
 */
/**
 * @typedef {object} AddSubrouterReturnValue
 * @property {React.Context<null>} context
 * @property {Provider} provider
 * @property {Router} router
 * @property {FunctionComponent} component - router wrapped with provider with
 *   context & history
 * @property {Store} store
 * @property {Connect} connect
 * @property {ReturnType<createSelectors>} selectors
 * @property {Reducer} reducer
 * @property {Object.<string, ActionCreator>} actions
 * @property {Unsubscribe} unsync
 */

const __DEV__ = process.env.NODE_ENV !== 'production',
  STORE_EXTENSIONS_LISTENERS_KEY = '_listeners',
  STORE_REF_PROP = 'current',
  DEST_SYNC_PROPKEY = 'sync',
  DEST_SYNC_ERRORS_PROPKEY = '_errors',
  SYNC_SRC_STATE_PROPKEY = 'router',
  SYNC_SRC_STATE_PROPVAL_INIT = {
    [SYNC_SRC_STATE_PROPKEY]: null,
    patches: [],
    inversePatches: [],
  },
  DEST_STATE_DEFAULT = {
    [DEST_SYNC_PROPKEY]: {
      [DEST_SYNC_ERRORS_PROPKEY]: [],
    },
  },
  { getIn } = immerStructure;

const genNewSrcStore =
  (newUniqueSynchedProp, srcReducer, srcHistory) =>
    configureStore({
      reducer: createReducer(
        {
          [SYNC_SRC_STATE_PROPKEY]: { },
          patches: [ ],
          inversePatches: [ ],
        },
        {
          [SYNC_SRC_STATE_PROPKEY]: srcReducer,
          // These are noops just so redux doesn't remove the corresponding
          // state keys. The whole state object is actually set in `srcReducer`.
          patches(state, action) { },
          inversePatches(state, action) { },
        },
      ),
      middleware: [
        routerMiddleware(srcHistory),
        ...getDefaultMiddleware({ thunk: false }),
      ],
      devTools: __DEV__ && {
        shouldCatchErrors: true,
        get name() {
          return this._name || (
            this._name =
              typeof window === 'object'
              && typeof window.document === 'object'
              && typeof window.document.title === 'string'
                ? `${window.document.title} - ${newUniqueSynchedProp}`
                : newUniqueSynchedProp
          );
        },
      },
    });

/**
 * This allows us to recover the sync reducers used the last time we received a
 * particular store so we can combine it with a new reducer. Since it's a weak
 * reference we won't hold onto unused reducers.
 * @type {WeakMap<EnhancedStore, ReducersMapObject>}
 */
const syncReducersRefmap = new WeakMap(),
/**
 * @param {string} newUniqueSynchedProp
 * @param {Slice} newSynchedSlice
 * @param {EnhancedStore} prevStore
 * @param {ConfigureStoreOptions} configureStoreOpts
 * returns {EnhancedStore}
 */
  genReplacementDestStore =
    (newUniqueSynchedProp, newSynchedSlice, prevStore, configureStoreOpts) => {
      // TODO: proxy `newStore.replaceReducer(reducer)` and intercept the new reducer
      const prevSyncReducers = syncReducersRefmap.get(prevStore) || {};
      const newSyncReducers = {
        ...prevSyncReducers,
        [newUniqueSynchedProp]: newSynchedSlice.reducer,
      };
      const newStore = configureStore({
        ...configureStoreOpts,
        reducer: createReducer(
          _merge({}, prevStore.getState(), {
            [DEST_SYNC_PROPKEY]: {
              [newUniqueSynchedProp]: {},
              [DEST_SYNC_ERRORS_PROPKEY]: {
                [newUniqueSynchedProp]: [],
              },
            },
          }),
          {
            ...configureStoreOpts.reducer,
            [DEST_SYNC_PROPKEY]: combineReducers(newSyncReducers),
          },
        ),
      });
      syncReducersRefmap.set(newStore, newSyncReducers);
      // syncReducersRefmap.delete(prevStore);  // TODO: uncomment?
      return newStore;
    };

const genSyncSelectors = () => {
  const getPatches = srcState => srcState.patches,
    getInversePatches = srcState => srcState.inversePatches,
    getActual = srcState => getIn(srcState, [ SYNC_SRC_STATE_PROPKEY ]),
    createDestPayload = createSelector(
      getActual,
      getPatches,
      getInversePatches,
      (newState, patches, inversePatches) => ({
        newState, patches, inversePatches,
      }),
    );
  return {
    getPatches,
    getInversePatches,
    getActual,
    createDestPayload,
  };
};

/**
 * @param {SyncSubstateOptions} opts
 * @returns {Unsubscribe} - Function to stop synching
 */
function syncSubstate({ destStore, syncActionCreator, srcStore }) {
  const { createDestPayload } = genSyncSelectors();
  let prevDestPayload = null, isFirst = true;
  return srcStore.subscribe(() => {
    const destPayload = createDestPayload(srcStore.getState());
    if(isFirst || prevDestPayload !== destPayload) {
      prevDestPayload = destPayload;
      destStore.dispatch(syncActionCreator({ ...destPayload, isFirst }));
    }
    isFirst = false;
  });
}

const createSubrouterSelectors = routerName => {
  const destSelectors = {};
  // this gets us to { ...routerstate }
  destSelectors.getDestSubState = state => getIn(
    state,
    [DEST_SYNC_PROPKEY, routerName],
  );
  // We start by making a selector to the sync errors for this router
  // this gets us to [ syncerror1, ... ]
  destSelectors.getSyncErrors = state => getIn(
    state,
    [ DEST_SYNC_PROPKEY, DEST_SYNC_ERRORS_PROPKEY, routerName ],
  );
  // This gets us to the synched state of our router, then returns an object
  //{ [SYNC_SRC_STATE_PROPKEY]: routerState }. This makes it appear to the
  // baseSelectors as if our router state is at
  // { router: { ...routerstate } }, which is the only place
  // connected-react-router's selectors will look
  destSelectors.getDestPseudoState = createSelector(
    destSelectors.getDestSubState,
      destSubState => ({ [SYNC_SRC_STATE_PROPKEY]: destSubState }),
  );
  // Here we make selectors that are identical to the connected-react-router
  // ones except they search a different state path. We also make the base
  // selector available at destSelectors[name].base
  //
  // We also want to make a "safe" variety that checks
  // state[DEST_SYNC_ERRORS_PROPKEY][routerName] to see if there has been a
  // sync error and and returns an object { value, lastError = null, errors = null }
  const baseSelectors = createSelectors(immerStructure);
  const nullIfEmpty = arr => Array.isArray(arr) ? arr : (arr[0] || null);
  for(const [ name, baseSelector ] of Object.entries(baseSelectors)) {
    if(name !== 'createMatchSelector') {
      destSelectors[name] = createSelector(
        destSelectors.getDestPseudoState,
        baseSelector,
      );
      destSelectors[name].base = baseSelector;
      destSelectors[name].safe = createSelector(
        destSelectors[name],
        destSelectors.getSyncErrors,
        (val, errors) => ({
          errors,
          value: val,
          lastError: nullIfEmpty(errors),
        }),
      );
    }
  }
  // this returns a selector creator so we treat it differently
  destSelectors.createMatchSelector = path => createSelector(
    destSelectors.getDestPseudoState,
    baseSelectors.createMatchSelector(path),
  );
  destSelectors.createMatchSelector.base = baseSelectors.createMatchSelector;
  destSelectors.createMatchSelector.safe = path => createSelector(
    destSelectors.createMatchSelector(path),
    destSelectors.getSyncErrors,
    (func, errors) => ({
      errors,
      value: func,
      lastError: nullIfEmpty(errors),
    })
  );
  return destSelectors;
};

/**
 * @param {History} history
 * @returns {Reducer<any>}
 */
const createSyncSourceReducer = history => {
  const routerReducer = createConnectRouter(immerStructure)(history),
    initState = Object.assign(
      {},
      SYNC_SRC_STATE_PROPVAL_INIT,
      { [SYNC_SRC_STATE_PROPKEY]: routerReducer() },
      ),
    patchReducer = produceWithPatches(routerReducer, initState);
  return (state = initState, action) => {
    if([LOCATION_CHANGE, CALL_HISTORY_METHOD].includes(action.type)) {
      const [ newState, patches, inversePatches ] = patchReducer(state, action);
      return { [SYNC_SRC_STATE_PROPKEY]: newState, patches, inversePatches };
    }
    return state;
  };
};

/** @returns {React.Context} */
const createSubrouterContext = (name = 'Subrouter', initVal = null) =>
  Object.defineProperty(
    React.createContext(initVal),
    'displayName', { value: name },
  );

const createSubrouterProvider = (store, context) => props => (
  <Provider store={store} context={context} {...props} />
);

const createConnectSubrouterProvider = context =>
  function connectSubrouterProvider(...args) {
    const options = Object.assign({ context }, args.length > 3 ? args[3] : {});
    const useArgs = Array.from({ length: 3 }, (_, i) => (args[i] || null));
    return connect(...useArgs, options);
  };

/**
 * @param {History} history
 * @param {React.Context} context
 * @returns {ReturnType<typeof createConnectedRouter>}
 */
const createSubrouter = (history, context) => {
  const ConnectedImmerRouter = createConnectedRouter(immerStructure)();
  return props => (
    <ConnectedImmerRouter history={history} context={context} {...props} />
  );
};

/**
 * @template T
 * @type {object}
 * @property {function(T): T} state
 * @property {function(T): T} patch
 */
const remap = {
  /**
   * @template T, U
   * @param {T} _state
   * @param {U} newParentProp
   * @returns {Object.<DEST_SYNC_ERRORS_PROPKEY, Object.<string, T>>}
   */
  state: (_state, newParentProp) => ({
    [DEST_SYNC_PROPKEY]: {
      [`${newParentProp}`]: _state,
    },
  }),
  /**
   * @param {Patch} _patch
   * @param {string} newParentProp
   * @returns {Patch}
   */
  patch: (_patch, newParentProp) => ({
    ..._patch,
    path: [ DEST_SYNC_PROPKEY, newParentProp, ..._patch.path ],
  }),
};

/** @typedef {import("immer").Patch} Patch */
/** @typedef {import("connected-react-router").LocationChangePayload} LocationChangePayload */

const createSyncDestSlice = (sliceName, sliceReducers = {}, sliceState = {}) =>
  createSlice({
    name: DEST_SYNC_PROPKEY,
    initialState: { ...sliceState },
    reducers: {
      ...sliceReducers,
      [sliceName]: {
        /**
         * @typedef {object} SubrouterReducerPayload
         * @property {Draft<LocationChangePayload>} newState
         * @property {Patch[] | null} patches
         * @property {Patch[] | null} inversePatches
         */
        /** @typedef {PreparedAction<SubrouterReducerPayload> & {error?: any, meta: { isFirst: boolean }}} SyncAction */
        /**
         * @param {Draft<LocationChangePayload>} state
         * @param {SyncAction} action
         * @returns {void | typeof sliceState}
         */
        reducer(state, { payload, error, meta: { isFirst } }) {
          try {
            const { newState, patches } = payload;
            if(isFirst) return newState;
            if(error) state[DEST_SYNC_ERRORS_PROPKEY][sliceName].push(error);
            if(Array.isArray(patches) && patches.length)
              try {
                applyPatches(state, patches);
              } catch(err0) {
                // try replacing the whole
              }
          } catch(err) {
            const errPrelude = `Router sync error - reverting sync of ` +
                                      `${DEST_SYNC_PROPKEY}/${sliceName}`;
            if(__DEV__) console.error(errPrelude, err);
            else console.debug(errPrelude, err);
            // this causes any changes we've made up to this point to be discarded
            return original(state);
          }
        },
        /**
         * @param {object} obj
         * @param {LocationChangePayload} obj.newState
         * @param {Patch[]} obj.patches
         * @param {Patch[]} obj.inversePatches
         * @param {boolean} obj.isFirst
         * @returns {{
         *     payload: {
         *         inversePatches: null | Patch[],
         *         patches: null | Patch[],
         *         newState: {} | LocationChangePayload,
         *     },
         *     meta: { isFirst?: boolean },
         *     error: null | {
         *         name: string,
         *         message: string,
         *         stack?: string,
         *     }
         * }}
         */
        prepare({ newState, patches, inversePatches, isFirst = false }) {
          /** @type {{} | LocationChangePayload} */
          const remappedNewState = {};
          /** @type {Patch[]} */
          const remappedPatches = [];
          /** @type {Patch[]} */
          const remappedInversePatches = [];
          /** @type {{ isFirst: boolean}} */
          const meta = { isFirst };
          try {
            // need to remap the src path to this path
            Object.assign(remappedNewState, remap.state(newState));
            if(isFirst) {
              return {
                meta: { isFirst }, error: null, payload: {
                  // @ts-ignore
                  newState: remappedNewState,
                  patches: null,
                  inversePatches: null,
                },
              };
            }
            if(Array.isArray(patches)) {
              for(const patch of patches) {

                const rePatch = remap.patch(patch);
                remappedPatches.push(rePatch);
              }
            }
            if(Array.isArray(inversePatches)) {
              for(const invPatch of inversePatches)
                remappedInversePatches.push(remap.patch(invPatch));
            }
            return {
              meta, error: null,
              payload: {
                // @ts-ignore
                newState: remappedNewState,
                patches: remappedPatches,
                inversePatches: remappedInversePatches,
              },
            };
          } catch(err) {
            const pfx = `[${DEST_SYNC_PROPKEY}/${sliceName}] Prepare error`;
            if(__DEV__) console.error(pfx, err);
            else console.debug(pfx, err);
            const { name, message, stack } = (err || {});
            return {
              meta, error: { name, message, stack },
              payload: {
                newState: remappedNewState,
                patches: remappedPatches,
                inversePatches: remappedInversePatches,
              },
            };
          }
        },
      }
    },
  });

const _extensions = {

  /**
   * we make space for the `unsubscribe` functions so the user can stop
   * synching the other store to this one
   */
  [STORE_EXTENSIONS_LISTENERS_KEY]: {},

  /**
   * @param {Store} storeInstance
   * @param {StoreRef} storeRef
   * @param {ConfigureStoreOptions} opts
   * @returns {function(AddSubrouterOptions): AddSubrouterReturnValue}
   */
  addSubrouter: _memoize((storeInstance, storeRef, opts) => {

    /**
     * src* variables pertain to the new store associated with the subrouter
     * dest* variables pertain to the `storeInstance` store
     * @param {AddSubrouterOptions} props
     * @returns {AddSubrouterReturnValue}
     */
    return ({ history: srcHistory, name = 'Subrouter' }) => {

      // make a unique name which will be its prop key in the new state
      let uniqName = name, uniquenessTries = 0;
      while(opts.reducer[uniqName]) uniqName = `${name}${++uniquenessTries}`;
      const destSubrouterSelectors = createSubrouterSelectors(uniqName);
      const srcReducer = createSyncSourceReducer(srcHistory);
      const SrcContext = createSubrouterContext(`${name}Context`);
      const SrcProvider = createSubrouterProvider(srcReducer, SrcContext);
      const SrcRouter = createSubrouter(srcHistory, SrcContext);
      const srcConnectSubrouter = createConnectSubrouterProvider(SrcContext);
      const subrouterComponent = ({ children }) => (
        <SrcProvider>
          <SrcRouter>
            {children}
          </SrcRouter>
        </SrcProvider>
      );

      const newSliceState = null;  // just quieting compile errors...
      const subrouterSlice =
        createSyncDestSlice(
          uniqName,
          opts.reducer[DEST_SYNC_PROPKEY] || {},
          newSliceState,
        );

      const subrouterSyncActionCreator = subrouterSlice.actions[uniqName];

      /**
       * add a reference to the `unsubscribe` function on the outer object's
       * WeakSet so it's not garbage collected
       */
      this[STORE_EXTENSIONS_LISTENERS_KEY][uniqName] =
        syncSubstate({
          destStore: storeInstance,
          syncActionCreator: subrouterSyncActionCreator,
          srcStore: srcReducer,
        }).bind(this[STORE_EXTENSIONS_LISTENERS_KEY]);

      /**
       * when the user wants to unlisten we delete the `unsubscribe` reference
       * so it can be garbage collected
       */
      const unsyncSubrouter =
        new Proxy(this[STORE_EXTENSIONS_LISTENERS_KEY][uniqName], {
          apply: (targetUnlisten, thisArg, argArray) => {
            const rv = targetUnlisten.apply(thisArg, argArray);
            delete this[STORE_EXTENSIONS_LISTENERS_KEY][uniqName];
            return rv;
          },
        });

      /**
       * create a new store and make it available to user by changing the
       * store reference to refer to this one
       */
      storeRef[STORE_REF_PROP] = configureStore({
        ...opts,
        reducer: {
          ...opts.reducer,
          [DEST_SYNC_PROPKEY]: subrouterSlice.reducer,
        },
      });

      return {
        unsync: unsyncSubrouter,
        router: SrcRouter,
        reducer: subrouterSlice.reducer,
        actions: subrouterSlice.actions,
        store: srcReducer,
        context: SrcContext,
        provider: SrcProvider,
        connect: srcConnectSubrouter,
        selectors: destSubrouterSelectors,
        component: subrouterComponent,
      };
    };
  }),
};

const _noopProxyHandlers = {
  construct: (target, argumentsList, newTarget) => {
    return Reflect.construct(target, argumentsList, newTarget);
  },
  defineProperty: (target, propertyKey, attributes) => {
    return Reflect.defineProperty(target, propertyKey, attributes);
  },
  deleteProperty: (target, propertyKey) => {
    return Reflect.deleteProperty(target, propertyKey);
  },
  get: (target, propertyKey, receiver) => {
    return Reflect.get(target, propertyKey, receiver);
  },
  getOwnPropertyDescriptor: (target, propertyKey) => {
    return Reflect.getOwnPropertyDescriptor(target, propertyKey);
  },
  getPrototypeOf: (target) => {
    return Reflect.getPrototypeOf(target);
  },
  has: (target, propertyKey) => {
    return Reflect.has(target, propertyKey);
  },
  isExtensible: (target) => {
    return Reflect.isExtensible(target);
  },
  ownKeys: (target) => {
    return Reflect.ownKeys(target);
  },
  preventExtensions: (target) => {
    return Reflect.preventExtensions(target);
  },
  set: (target, propertyKey, value, receiver) => {
    return Reflect.set(target, propertyKey, value, receiver);
  },
  setPrototypeOf: (target, prototype) => {
    return Reflect.setPrototypeOf(target, prototype);
  },
  apply: (target, thisArg, argsArr) => {
    return Reflect.apply(target, thisArg, argsArr);
  },
};

const reinterp = reinterpterer =>
  compose(
    Object.fromEntries,
    entries => entries.map(
      ([accessor, reflector]) => reinterpterer(accessor, reflector)
    ),
    Object.entries,
  )(_noopProxyHandlers);

const retarget = (newTgt, accessors = Object.keys(_noopProxyHandlers)) =>
  reinterp(
    (accessor, reflector) =>
      accessors.includes(accessor)
        ? [accessor, (tgt, ...args) => reflector(newTgt, ...args)]
        : [accessor, reflector]
  );

const isExtension = (prop, ...ignore) =>
  typeof _extensions[prop] === 'function'
  && !ignore.includes(prop);

/**
 * @param {EnhancedStore} storeInstance
 * @param {ConfigureStoreOptions} opts
 * @returns {InstanceType<Proxy<EnhancedStore & (typeof _extensions)>>}
 */
export const wrapStore = (storeInstance, opts) => {
  const REF_CNTR = 'instanceNum',
    storeRef = { [STORE_REF_PROP]: storeInstance, [REF_CNTR]: 0n },
    retargeted = retarget(storeRef[STORE_REF_PROP]);
  return new Proxy(storeRef, {
    ...retargeted,
    get: (target, prop, thisProxy) =>
      isExtension(prop, STORE_EXTENSIONS_LISTENERS_KEY)
        ? _extensions[prop](target[STORE_REF_PROP], thisProxy, opts)
        : target[STORE_REF_PROP][prop],
    set: (target, propertyKey, value) => {
      if(propertyKey === STORE_REF_PROP) {
        storeRef[REF_CNTR]++;
        return (storeRef[propertyKey] = value);
      }
      return (target[propertyKey] = value);
    }
  });
};

/**
 * @alias {configureStore}
 * @param {function(ConfigureStoreOptions): EnhancedStore} configStoreFunc
 * @returns {function(ConfigureStoreOptions): ReturnType<typeof wrapStore>}
 */
export function extendConfigureStore(configStoreFunc = configureStore) {
  return new Proxy(configStoreFunc, {
    apply: (target, thisArg, argsArr) =>
      wrapStore(target.apply(thisArg, argsArr), [...argsArr, null][0])
  });
}


// class StoreCache {
//   // WeakRef status: https://bugs.chromium.org/p/v8/issues/detail?id=8179
//   static _nEntities = 0n;
//   // static _liveStores = new WeakSet();
//   static _src2tgtConfigMap = new WeakMap();
//   static _tgt2srcConfigMap = new WeakMap();
//   // static _startReaper() {
//   //   // @ts-ignore
//   //   this._reaperID = setInterval(() => {
//   //     let sTime = 0;
//   //     if(__DEV__) {
//   //       console.debug('Starting StoreCache reaper...');
//   //       sTime = Date.now();
//   //     }
//   //     for(const [ srcStore, ] of this._src2tgtConfigMap) {
//   //       if(!this._liveStores.has(srcStore)) {
//   //         this._src2tgtConfigMap.delete(srcStore);
//   //         this._nEntities--;
//   //       }
//   //     }
//   //     for(const [ tgtStore, ] of this._tgt2srcConfigMap) {
//   //       if(!this._liveStores.has(tgtStore)) {
//   //         this._tgt2srcConfigMap.delete(tgtStore);
//   //         this._nEntities--;
//   //       }
//   //     }
//   //     if(this._nEntities === 0n) {
//   //       clearInterval(this._reaperID);
//   //       this._reaperID = -1;
//   //     }
//   //     if(__DEV__) {
//   //       console.debug(`StoreCache reaper took ${Date.now() - sTime}ms`);
//   //     }
//   //   }, 10 * 1000);
//   // }
//   static _STORE_ID_IDX = 0;
//   static _CORRESPONDING_STORE_IDX = 1;
//   static _CONFIG_IDX = 2;
//   static _idCfgMap = new Map();
//   add(sourceStore, targetStore, config) {
//     return StoreCache.add(sourceStore, targetStore, config);
//   }
//   static add(sourceStore, targetStore, config = {}) {
//     const src2TgtId = nanoid(), src2TgtArr = [];
//     src2TgtArr[this._STORE_ID_IDX] = src2TgtId;
//     src2TgtArr[this._CORRESPONDING_STORE_IDX] = targetStore;
//     src2TgtArr[this._CONFIG_IDX] = config;
//     this._idCfgMap[src2TgtId] = config;
//     this._src2tgtConfigMap.set(sourceStore, src2TgtArr);
//     // this._liveStores.add(sourceStore);
//     this._nEntities++;
//     const tgt2SrcId = nanoid(), tgt2SrcArr = [];
//     tgt2SrcArr[this._STORE_ID_IDX] = tgt2SrcId;
//     tgt2SrcArr[this._CORRESPONDING_STORE_IDX] = sourceStore;
//     tgt2SrcArr[this._CONFIG_IDX] = config;
//     this._idCfgMap[tgt2SrcId] = config;
//     this._tgt2srcConfigMap.set(targetStore, tgt2SrcArr);
//     // this._liveStores.add(targetStore);
//     this._nEntities++;
//     // if(this._reaperID === -1) {
//     //   this._startReaper();
//     // }
//   }
//   get(obj, isTarget = true) {
//     return StoreCache.get(obj, isTarget);
//   }
//   static get(obj, isTarget = true) {
//     const arrOrNull = isTarget
//       ? this._tgt2srcConfigMap.get(obj)
//       : this._src2tgtConfigMap.get(obj);
//     if(!Array.isArray(arrOrNull)) return null;
//     return arrOrNull[1];
//   }
//   get size() { return StoreCache.size; }
//   static get size() { return this._nEntities; }
// }


const makeConnectedReactRouterStructure = (srcMount, tgtMount = []) => ({
  getIn: (draft, path) => Array.isArray(path) && !!draft
    ? [].concat(path).reduce(
        (prev, curr) => !!prev ? prev[curr] : undefined, draft
      )
    : undefined,
  merge: (draft, payload) => { Object.assign(draft, payload); },
  fromJS: val => val,
  toJS: val => val,
});



function configureSynchedStore(tgtStore, tgtStateMountPt, configureStoreOpts) {
  const tgtCurrState = tgtStore.getState();
  const tgtNewState = {
    ...tgtCurrState,
    [tgtStateMountPt]: null,
    _syncErrors: {
      ...(tgtCurrState._syncErrors || {}),
      [tgtStateMountPt]: [],
    },
  };
  const srcStore = configureStore({
    ...configureStoreOpts,
  });
  srcStore.subscribe(() => {

  });

}
