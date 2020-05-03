/// <reference path="./configureSynchedStore.d.ts" />
// @ts-nocheck
// import routerMiddleware from 'connected-react-router/esm/middleware';
// import createConnectRouter from 'connected-react-router/esm/reducer';
// import { CALL_HISTORY_METHOD } from 'connected-react-router/esm/actions';
// import { LOCATION_CHANGE } from 'connected-react-router/esm/actions';
// import createConnectedRouter from 'connected-react-router/esm/ConnectedRouter';
// import createCRRSelectors from 'connected-react-router/esm/selectors';
// import { combineReducers } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
// import { nanoid } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
// import { compose as rdxCompose } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
// import { createStore } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
// import { applyMiddleware } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
// import { configureStore } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
// import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
// import { createSelector } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
// import { createReducer } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
// import { getDefaultMiddleware } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
// import { createConnect } from 'react-redux/es/connect/connect';
// import connect from 'react-redux/es/connect/connect';
// import Provider from 'react-redux/es/components/Provider';
// import { produceWithPatches } from 'immer/dist/immer.esm';
// import immerStructure from '../struct/immerStructure';
// import _set from 'lodash/set';

import { createAction } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { createDraft} from 'immer/dist/immer.esm';
import { isDraft } from 'immer/dist/immer.esm';
import { isDraftable } from 'immer/dist/immer.esm';
import plainStructure from 'connected-react-router/esm/structure/plain';
import { applyPatches } from 'immer/dist/immer.esm';
import { finishDraft } from 'immer/dist/immer.esm';
import { produce } from 'immer/dist/immer.esm';
import { original } from 'immer/dist/immer.esm';

// import R$useWith from 'ramda/es/useWith';
// import R$curry from 'ramda/es/curry';
// import R$converge from 'ramda/es/converge';
// import R$defaultTo from 'ramda/es/defaultTo';
// import R$flatten from 'ramda/es/flatten';
// import R$nAry from 'ramda/es/nAry';
// import R$append from 'ramda/es/append';
// import R$last from 'ramda/es/last';
// import R$not from 'ramda/es/not';
// import R$thunkify from 'ramda/es/thunkify';
// import R$bind from 'ramda/es/bind';
// import R$call from 'ramda/es/call';
// import R$binary from 'ramda/es/binary';
// import R$hasPath from 'ramda/es/hasPath';
// import R$pipeWith from 'ramda/es/pipeWith';
// import R$apply from 'ramda/es/apply';
// import { revokeScope} from 'immer/dist/immer.esm';
// import R$__ from 'ramda/es/__';
// import R$transduce from 'ramda/es/transduce';
// import R$o from 'ramda/es/o';
// import R$nth from 'ramda/es/nth';
// import R$remove from 'ramda/es/remove';

import R$equals from 'ramda/es/equals';
import R$filter from 'ramda/es/filter';
import R$where from 'ramda/es/where';
import R$pipe from 'ramda/es/pipe';
import __ from 'ramda/es/__';
import R$pick from 'ramda/es/pick';
import R$tryCatch from 'ramda/es/tryCatch';
import R$slice from 'ramda/es/slice';
import R$over from 'ramda/es/over';
import R$lensProp from 'ramda/es/lensProp';
import R$drop from 'ramda/es/drop';
import R$lensPath from 'ramda/es/lensPath';
import R$concat from 'ramda/es/concat';
import R$view from 'ramda/es/view';
import R$map from 'ramda/es/map';
import R$applySpec from 'ramda/es/applySpec';
import R$is from 'ramda/es/is';
import R$nthArg from 'ramda/es/nthArg';
import R$composeWith from 'ramda/es/composeWith';
import R$compose from 'ramda/es/compose';
import R$ifElse from 'ramda/es/ifElse';
import R$identity from 'ramda/es/identity';
import R$always from 'ramda/es/always';
import R$unless from 'ramda/es/unless';
import R$singleton from 'ramda/es/of';
import R$toString from 'ramda/es/toString';
import R$length from 'ramda/es/length';
import R$partial from 'ramda/es/partial';
import R$propEq from 'ramda/es/propEq';
import R$cond from 'ramda/es/cond';
import R$isNil from 'ramda/es/isNil';
import R$curryN from 'ramda/es/curryN';
import R$memoizeWith from 'ramda/es/memoizeWith';
import R$unapply from 'ramda/es/unapply';
import R$applyTo from 'ramda/es/applyTo';
import R$T from 'ramda/es/T';
import R$unnest from 'ramda/es/unnest';
import R$assocPath from 'ramda/es/assocPath';
import R$path from 'ramda/es/path';
import R$move from 'ramda/es/move';
import R$pathOr from 'ramda/es/pathOr';
import R$dissocPath from 'ramda/es/dissocPath';
import R$converge from 'ramda/es/converge';
import R$o from 'ramda/es/o';
import R$apply from 'ramda/es/apply';
import R$juxt from 'ramda/es/juxt';
import R$init from 'ramda/es/init';
import R$last from 'ramda/es/last';
import R$splitAt from 'ramda/es/splitAt';

/**
 * @template T
 * @typedef {import("immer").Draft<T>} Draft<T>
 */
/**
 * @template T
 * @typedef {import("redux").Reducer<T>} Reducer<T>
 */
/**
 * @typedef {typeof import("react-redux").Provider} Provider
 */
/**
 * @typedef {import("immer").Patch} Patch
 */
/**
 * @template S
 * @typedef {object} AccessStructure -
 *     Object that tells the enhancer how to access and update the source state
 * @property {function(object, string[]): any | any[]} getIn -
 *     Function that takes an object and a node path array and returns the
 *     value at that node path
 * @property {function(S, any | any[]): (S | void)} merge -
 *     Function that takes an object of type S (probably a state object) and
 *     merges it with a payload value.
 * @property {function(any | any[]): any | any[]} fromJS -
 *     Function that takes some origin value and converts it into a plain
 *     javascript value
 * @property {function(any | any[]): any | any[]} toJS -
 *     Function that takes a plain javascript value and converts it into some
 *     target value
 */
/**
 * @typedef {{}} ErrorData
 * @property {string} name
 * @property {string} message
 * @property {string | null} [stack=null]
 */
/**
 * @callback PatchCourier
 * @param {Patch[]} patches
 * @param {Patch[]} invPatches
 * @returns {number} - Size of `byRefArray`
 */
/**
 * @typedef {[ (Draft | object), boolean, boolean ]} DraftResolution3Tuple
 */

const __DEV__ = process.env.NODE_ENV !== 'production';
const SYNC_ERR_PROP = '_syncerrors';
const DEST_SYNC_METHOD_NAME = 'sync';

const mkActionTypeName = name => `@@sync/${name}`;
const PATCH_STATE = mkActionTypeName('PATCH_STATE');
const SYNC_ERROR_AT_DEST = mkActionTypeName('SYNC_ERROR_AT_DEST');
const isArray = Array.isArray;
const memoize$ = R$memoizeWith(R$identity);
const memoizeAll$ = R$memoizeWith(R$unapply(R$toString));
const str$ = memoize$(R$toString);

/**
 * @template T
 * @param {any | any[]} maybeArr
 * @returns {T | [ T ] | null}
 */
const arrayify = memoize$(
  maybeArr =>
    Array.isArray(maybeArr)
      ? maybeArr
      : R$isNil(maybeArr) ? null
      : [ maybeArr ]
);
// const devlog = (err, level = 'error') => { if(__DEV__) console[level](err); };
// const R$propEq$ = memoize$(R$propEq);

const serialize = {};
serialize.error = R$pick([ 'name', 'message', 'stack' ]);
serialize.patches = R$applySpec({
  patches: R$compose(
    R$unless(
      isArray,
      R$always(null)
    ),
    R$nthArg(0),
  ),
  inversePatches: R$compose(
    R$unless(
      isArray,
      R$always(null)
    ),
    R$nthArg(1),
  ),
  error: R$compose(
    R$ifElse(
      R$is(Error),
      serialize.error,
      R$always(null)
    ),
    R$nthArg(2),
  ),
});

/**
 * Pushes new patches to `byRefArray`
 * @param {Patches[] | null} byRefArray
 * @param {AccessStructure<any>} struct
 * @returns {PatchCourier}
 */
const patchListener = (byRefArray, struct) =>
  (patches, invPatches) =>
    byRefArray.push(
      serialize.patches(
        struct.toJS(patches),
        struct.toJS(invPatches),
        null,
      )
    );

/**
 * @param {string | string[]} trackedPfx
 * @param {Patch} patch
 * @returns {boolean}
 */
const isSyncPatch = R$curryN(2) (
  memoizeAll$(trackedPfx => R$where({
    path: R$composeWith(
      R$partial(__, R$singleton(trackedPfx)),
      [ R$equals, R$slice(0)(R$length(__)) ]
    )
  }))
);

/**
 * @param {string | string[]} findPathPfx
 * @param {string | string[]} replacePathPfx
 * @param {Patch[]} patches
 * @returns {Patch[]}
 */
const _remapPatch = R$curryN(3) (
  (findPfx, replacePfx) =>
    R$map(__)(R$over(__)) (
      R$lensProp('path'),
      R$pipe(
        R$drop(findPfx.length),
        R$concat(arrayify(replacePfx)),
      )
    )
);

const remapPatch = R$curryN(3)((findPathPfx, replacePathPfx, patch) => {
  const [ findPathPfxArr, replacePathPfxArr ] = [
      arrayify(findPathPfx),
      arrayify(replacePathPfx)
    ],
    [ pfx, sfx ] = R$splitAt(findPathPfxArr.length, patch.path),
    newPfx = R$equals(pfx, findPathPfxArr) ? replacePathPfxArr : pfx;
  return {
    ...patch,
    path: newPfx.concat(sfx),
  };
});

/**
 * @example
 > const obj = { a: 1, b: { c: [ 99, 88 ] }, d: [ { e: 99 }, { f: 99 } ] }
 > const fromPath = [ 'b', 'c' ]
 > const toPath = [ 'b', 'ccc' ]
 > moveNode(toPath, fromPath, obj)
 { a: 1, b: { ccc: [ 99, 88 ] }, d: [ { e: 99 }, { f: 99 } ] }
 > moveNode(toPath, fromPath, obj)
 { a: 1, b: {}, d: [ { e: 99 }, { f: 99 } ], x: { y: [ 99, 88 ] }}
 *
 * @param {string | string[]} toPath
 * @param {string | string[]} fromPath
 * @param {object} inObject
 * @returns {object}
 */
const moveNode = R$curryN(3) (  // (toPath, fromPath, inObject) => (
  R$compose(R$apply(__) (
    R$converge(R$assocPath) ([
      R$nthArg(2),
      R$pathOr({}),
      R$dissocPath,
    ])),
    R$move(0, -1),  // [a[], b[], c] --> [b[], c, a[]]
    R$juxt([  // [(a|a[]), (b|b[]), c] --> [a[], b[], c]
      R$pipe(R$init, R$map(arrayify)),
      R$last,
    ]),
    R$unapply(R$identity),  // ((a|a[]), (b|b[]), c) --> [(a|a[]), (b|b[]), c]
  )
)  /* )(toPath, fromPath, inObject) */ ;

/**
 * @callback
 * @param {Patches[] | null} patches
 * @param {Patches[] | null} invPatches
 * @param {ErrorData} srcError
 * @returns {{
 *     error: (ErrorData | null),
 *     payload: {
 *         patches: Patch[],
 *         inversePatches: Patch[]
 *     }
 * }}
 */
const syncToDestStateAction = createAction(
  PATCH_STATE, R$unnest(__)(R$applySpec(__))({
    error: R$pipe(
      R$nthArg(2),
      R$ifElse(R$isNil, R$always(null), serialize.error),
    ),
    payload: {
      patches: R$applyTo(R$nthArg(0), __),
      inversePatches: R$applyTo(R$nthArg(1), __),
    },
  })(R$compose(R$map(remapPatch), R$filter(isSyncPatch)))
);

/**
 * @param {Error} error
 * @returns {{ error: ErrorData, payload: null }}
 */
const syncErrorAtDestAction = createAction(
  SYNC_ERROR_AT_DEST, R$applySpec({
    payload: R$always(null),
    error: R$tryCatch(
      serialize.error(__),
      serialize.error,
    )
  })
);

/**
 * @param {Reducer} elseReducer
 * @param {string} stateMountProp
 * @param {AccessStructure} struct
 * @param {object} [initState={}]
 * @returns {Function}
 */
const createDestSyncReducer =
  (elseReducer, stateMountProp, struct, initState = {}) =>
    (state = initState, action) => {

      const addErrs = (draft, error_s) => {
        const currErrs = arrayify(error_s);
        const prevErrs = arrayify(draft[SYNC_ERR_PROP][stateMountProp]);
        draft[SYNC_ERR_PROP][stateMountProp] = currErrs.concat(prevErrs);
      };

      const mutateDraft = mutatingFunc => {
        let wasErr = null;
        const { toJS } = struct, [
          draft,
          wasDraft,
          isDraft
        ] = resolveDraft(toJS(state));
        try {
          const { payload, error, meta } = action;
          mutatingFunc(draft, payload, error, meta);
        } catch(err) {
          wasErr = err;
          return original(draft);
        } finally {
          if(wasErr) throw wasErr;
          if(wasDraft) return;
          if(draft && isDraft(draft)) return finishDraft(draft);
        }
      };

      return R$cond([
        [
          R$propEq('type', str$(syncToDestStateAction)),
          () => {
            mutateDraft((draft, payload, error) => {
              addErrs(draft, error);
              applyPatches(draft, payload.patches);
            });
          },
        ],
        [
          R$propEq('type', str$(syncErrorAtDestAction)),
          () => mutateDraft((draft, payload, error) => {
            addErrs(draft, error);
          }),
        ],
        [ R$T, elseReducer ],
      ])(state, action);
    };

const initializeDraft = (draft, mountProp, struct, overwrite = true) => {
  try {
    const [ prelude, errRepr ] = [
      'Your preloaded state already includes',
      `"${SYNC_ERR_PROP}": { "${mountProp}": { ... } }`,
    ];
    if(draft[mountProp] && !overwrite) throw new Error(
      `${prelude} "${mountProp}"`
    );
    if(draft[SYNC_ERR_PROP]) {
      if(draft[SYNC_ERR_PROP][mountProp] && !overwrite) throw new Error(
        `${prelude} "${errRepr}"`
      );
    } else { draft[SYNC_ERR_PROP] = {}; }
    draft[SYNC_ERR_PROP][mountProp] = [];
    draft[mountProp] = {};
    return struct.fromJS(finishDraft(draft));
  } catch(err) {
    // revokeScope(draft);
    throw err;
  }
};

/*
const mkDestStoreReducerWrapper =
  (syncPatchesAction, syncErrorAction, initSrcState, errorsObjPath) =>
    origReducer =>
      (state = initSrcState, action) => {
        const WATCH_ACTIONS = [
          syncPatchesAction.type,
          syncErrorAction.type,
        ];
        const { type, payload, error, meta } = action;
        if(![WATCH_ACTIONS].includes(type))
          return origReducer(state, action);
        let draft = state, startedAsDraft = false;
        try {
          startedAsDraft = isDraft(draft);
          if(!startedAsDraft && isDraftable(draft))
            draft = createDraft(draft);
          switch(type) {
            case syncPatchesAction.type:
              const { patches, inversePatches } = payload;
              applyPatches(draft, patches);
              break;
            case syncErrorAction.type:
              break;
            default:
              throw new Error(`Unrecognized action type "${type}"`);
          }
          if(error)
            _set(draft, errorsObjPath, error);
        } finally {
          if(!startedAsDraft && isDraft(draft))
            // noinspection ReturnInsideFinallyBlockJS
            return finishDraft(draft);
        }
      };
*//*
const mkSrcStoreWatcher =
  (syncPatchesActionCreator, syncErrorActionCreator) =>
    (srcChangesArr, srcStore, destStore) => {
      let prevSrcState = srcStore.getState();
      return () => {
        const currSrcState = srcStore.getState();
        if(currSrcState !== prevSrcState) {
          while(srcChangesArr.length) {
            try {
              const { patches, inversePatches, error } = srcChangesArr.shift();
              destStore.dispatch(syncPatchesActionCreator(
                patches, inversePatches, error,
              ));
            } catch(err) {
              destStore.dispatch(syncErrorActionCreator(err));
            }
          }
          prevSrcState = currSrcState;
        }
      };
    };
*/

/**
 * @param {object | Draft} draftish -
 *     An object that might or might not be an Immer draft.
 * @param {boolean} throwOnUndraftable -
 *     Throw an exception if `maybeDraft` cannot be drafted.
 * @returns {DraftResolution3Tuple} -
 *     Returns a tuple of a draft and a boolean indicating whether it started as a draft.
 */
const resolveDraft = (draftish, throwOnUndraftable = true) => {
  if(isDraft(draftish)) return [draftish, true, true];
  if(isDraftable(draftish)) return [createDraft(draftish), false, true];
  if(throwOnUndraftable) throw new Error('The object is not Immer-draftable.');
  return [ draftish, false, false ];
};
////////////////////////////////////////////////////////////////////////////////

/**
 * Pass first to the source store's enhancer field, then to the destination
 * store's enhancer field
 * @example
 > const syncSrc = syncStoresEnhancer('count')  // only supports synching a single field ATM
 > const srcStore = createStore(
 ...   (state, action) => ({ count: state.count + action.payload }),  // reducer
 ...   { count: 0 },                                                  // preloadedState
 ...   compose(                                                       // enhancers
 ...     otherSrcEnhancer1,
 ...     syncSrc,  // this enhancer doesn't care about order
 ...     otherSrcEnhancer2,
 ...   )
 ... );
 > srcStore.getState()
 { count: 0 }
 > const tgtSync = srcStore.sync('srccount')
 > // - specify where in the target's state to store a copy of `syncSrc.getState()["count"]`
 > // - this will be mounted at the top level of the state, along with an _syncerrors key storing sync errors
 > // - there's no checking done ATM about whether we'll be overwriting an extant key so be careful
 > const tgtStore = createStore(
 ...   (state, action) => ({ todos: state.todos.concat(action.payload) }),  // reducer
 ...   { todos: [] },                                                       // preloadedState
 ...   compose(                                                             // enhancers
 ...     otherTgtEnhancer1,
 ...     otherTgtEnhancer2,
 ...     tgtSync,  // still doesn't care
 ...   )
 ... );
 > tgtStore.getState()
 {
   todos: [],
   srccount: 0,
   _syncerrors: {
     srccount:  [],
   },
 }
 > srcStore.dispatch({ payload: 3 })
 > srcStore.getState()
 { count: 3 }
 > tgtStore.getState()
 {
   todos: [],
   srccount: 3,
   _syncerrors: {
     srccount: []
   },
 }
 > tgtStore.unsync()
 > // - or `unsync('srccount')` if you're synching to >1 store and only want to unsync `srcStore`
 > srcStore.dispatch({ payload: -9 })
 > srcStore.getState()
 { count: -6 }
 > tgtStore.getState()
 {
   todos: [],
   srccount: 3,
   _syncerrors: {
     srccount: [],
   },
 }
 *
 * @template SRC_STATE, DEST_STATE
 * @param {string} syncSrcKey -
 *     Which nodes from the source state you want to sync with
 * @param {AccessStructure<SRC_STATE>} [srcAccessStructure=plainStructure] -
 *     Optional object that tells the enhancer how to access and update the
 *     source state
 */
export const syncStoresEnhancer =
  (syncSrcKey, srcAccessStructure) => {
    if(!syncSrcKey || typeof syncSrcKey !== 'string') throw new Error(
      `Invalid \`syncSrcKey\`: ${syncSrcKey}`
    );
    const srcStruct = { ...plainStructure, ...srcAccessStructure }, {
      toJS: srcToJS,
      fromJS: srcFromJS,
      getIn: srcGetIn,
      merge: srcMerge
    } = srcStruct;
    return createSrcStore => (srcReducer, srcPreloadedState) => {
      const srcChanges = [],
        srcStore = createSrcStore(
          produce(
            srcReducer,
            srcToJS(srcPreloadedState) || {},
            patchListener(srcChanges, srcStruct),
          ),
          srcPreloadedState,
        );
      srcStore[DEST_SYNC_METHOD_NAME] =
        (syncDestKey, destAccessStructure = {}, throwOnKeyExists = false) => {
          const destStruct = { ...plainStructure, ...destAccessStructure }, {
            merge: destMerge,
            getIn: destGetIn,
            fromJS: destFromJS,
            toJS: destToJS,
          } = destStruct;
          if(!syncDestKey || typeof syncDestKey !== 'string') throw new Error(
            `Invalid \`syncDestKey\`: ${R$toString(syncDestKey)}`
          );
          return createDestStore => (destReducer, destPreloadedState) => {

            const transferNode = (fromObj, fromPath) =>
              (toObj, toPath) => R$assocPath(
                arrayify(toPath),
                R$view(R$lensPath(arrayify(fromPath)), fromObj),
                toObj,
              );

            const destInit =
              transferNode(
                srcToJS(srcStore.getState()),
                syncSrcKey
              )(destToJS(
                destPreloadedState || {}
              ), syncDestKey);

            const resolvedPreloadedState =
              initializeDraft(
                resolveDraft(
                  R$assocPath(
                    arrayify(syncSrcKey),
                    R$path(arrayify(syncSrcKey), destFromJS(destInit)),
                    destToJS(destInit),
                  )
                )[0],
                syncDestKey,
                destStruct,
                !throwOnKeyExists,
              ),
              destStore = createDestStore(
                createDestSyncReducer(
                  destReducer,
                  syncDestKey,
                  destStruct,
                  resolvedPreloadedState,
                ),
                resolvedPreloadedState
              ),
              destDispatch = destStore.dispatch.bind(destStore),
              syncErrorAtDest = (err) => destDispatch(
                syncErrorAtDestAction(err)
              ),
              syncToDestState = (patches, inversePatches, error) =>
                destDispatch(syncToDestStateAction(
                  patches, inversePatches, error
                ));
            destStore.unsync = srcStore.subscribe(() => {
              try {
                while(srcChanges.length) try {
                  const {
                    error,
                    payload: { patches, inversePatches }
                  } = srcChanges.shift();
                  syncToDestState(patches, inversePatches, error);
                } catch(err) { syncErrorAtDest(err); }
              } catch(outerErr) { syncErrorAtDest(outerErr); } finally { }
            });
            return destStore;
          };
      };
      return srcStore;
    };
  };

export default syncStoresEnhancer;
