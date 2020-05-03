// @ts-nocheck
import { createAsyncThunk } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { batch } from 'react-redux/es';
import wrapActionCreators from 'react-redux/es/utils/wrapActionCreators';
import { LOCATION_CHANGE } from 'connected-react-router/esm/actions';
import { push } from 'connected-react-router/esm/actions';
import { bare_setShowTags } from './slices/reportSlice';
import { bare_setDisplayEmpty } from './slices/reportSlice';
import { bare_setDoAutoSelect } from './slices/reportSlice';
import { bare_setFilter } from './slices/reportSlice';
import { bare_setTesting } from '../../../../state/appSlice';
import { bare_unregisterPendingAction, } from './slices/synchronizationSlice';
import { bare_registerPendingAction } from './slices/synchronizationSlice';
import { getRegisteredPendingActionsForIdType } from './selectors/selectors';
import { getParsedSearchPure } from './selectors/selectors';
import { getLocation } from './selectors/selectors';
import { getParsedSearchParamVal } from './selectors/selectors';
import { objToQueryString } from '../../../../Common/utils';
import { createLocation } from 'history';

/** @typedef {import("redux")} Redux */
/** @typedef {import("@reduxjs/toolkit")} ReduxToolkit */
/** @typedef {ReturnType<typeof import("history").createHashHistory>} HashHistoryType */
/** @typedef {ReturnType<typeof import("history").createMemoryHistory>} MemoryHistoryType */
/** @typedef {ReturnType<typeof import("history").createBrowserHistory>} BrowserHistoryType */
/** @typedef {HashHistoryType | MemoryHistoryType | BrowserHistoryType} HistoryType */
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

// const __DEV__ = process.env.NODE_ENV !== 'production';
// const __TEST__ = process.env.NODE_ENV === 'test';

const displayEmptyParam = 'displayEmptyParam';
const filterParam = 'filterParam';
const showTagsParam = 'showTagsParam';
const doAutoSelectParam = 'doAutoSelectParam';
const isTestingParam = 'isTestingParam';

const mkRejection = ({ error, signal, comment = 'Unexpected rejection' }) => ({
  error, signal, comment,
});
const mkResolution = ({ caveat = null, comment = null }) => ({
  comment, caveat,
});
const currifyDispatch = dispatchFunc => action => {
  dispatchFunc(action);
  return dispatchFunc;
};
export const batchActions = createAsyncThunk(
  `${LOCATION_CHANGE}/triggeredActions`,
  /**
   * @param {object} arg
   * @param {Redux.Action<any>} arg.originalAction
   * @param {Array<Redux.Action<any> | Redux.ActionCreator<any>>} arg.additionalActions
   * @param {Redux.Action<any> | null} [arg.next=null]
   * @param {ReduxToolkit.GetThunkAPI<{}>} thunkAPI
   */
  async function payloadCreator(
    {
      originalAction,
      additionalActions,
      next: _next = null,
    },
    {
      dispatch: _dispatch,
      getState,
      extra: ogettoStoria,
      requestID,
      signal,
      rejectWithValue,
    }
  ) {
    try {
      return await new Promise((resolve, reject) => {
        // prefer going to the "next" middleware if it's passed in
        const dispatch = _next || _dispatch,
          skippedActions = [],
          registeredActionTypes = [];  // for cleanup in err hdlr
        function registerDispatchUnregister(action) {
          // this should always return an array of length 0, but if it's not
          // then there's a duplicate action waiting to complete (perhaps because
          // there are duplicate actions being dispatched by this thunk) so to
          // avoid repeat work we skip
          // TODO: evaluate whether this is the right approach...
          const duplicatePending = getRegisteredPendingActionsForIdType(
            getState(), { type: action.type, id: requestID }
          );
          if(duplicatePending.length > 0) {
            skippedActions.push(action);
            return;
          }
          dispatch(bare_registerPendingAction(action.type, requestID));
          registeredActionTypes.push(action.type);
          dispatch(action);
          dispatch(bare_unregisterPendingAction(action.type, requestID));
          registeredActionTypes.pop();
        }
        let currActionCreator = null,
          currAction = originalAction,
          i = -1;
        try {
          const numAddlActions =  additionalActions.length;
          batch(props => {
            if(currAction) registerDispatchUnregister(currAction);
            for(i = 0; i < numAddlActions; ++i) {
              const _currActionOrActionCreator = additionalActions[i];
              if(typeof _currActionOrActionCreator === 'function') {
                currActionCreator = _currActionOrActionCreator;
                currAction = currActionCreator(props);
                currActionCreator = null;
              } else currAction = _currActionOrActionCreator;
              if(signal && signal.abort)
                reject(mkRejection({ signal, comment: 'Detected abort' }));
              if(currAction)
                registerDispatchUnregister(currAction);
              currAction = null;
            }
            const saLen = skippedActions.length;
            resolve(mkResolution({
              comment: 'Completed batch run',
              caveat: saLen !== 0 ?
                `${saLen} skipped: "${saLen.map(a => a.type).join(", ")}"` :
                null
            }));
          }, { getState, extra: ogettoStoria });
        } catch(caughtBatchException) {
          const currActionType =
            typeof currActionCreator === 'function'
              ? currActionCreator.toString()
              : (currAction && currAction.type);
          let comment = `Batch failed at action[${i}] "${currActionType}"`,
            at, j = -1, error = { caughtBatchException };
          try {
            while((at = registeredActionTypes.pop())) {
              j++;
              try { dispatch(bare_unregisterPendingAction(at, requestID)); }
              catch(unregisterErr) {
                error = { ...error, [`unregister/${j}/${at}`]: unregisterErr };
              }
            }
            if(registeredActionTypes.length)
              comment += ` - leaving ${registeredActionTypes.length} stale ` +
                         `actions still registered.`;
          } catch(prepRejectError) { error = { ...error, prepRejectError }; }
          reject(mkRejection({ error, comment }));
        }
      });
    } catch(error) { rejectWithValue(mkRejection({ error })); }
  },
  { condition: () => true, dispatchConditionRejection: false },
);

/*
const isTestingURLParams = [], isDevURLParams = [];
if(__DEV__) {
  isDevURLParams.push(
    'dev', 'devel', 'isDev', 'isDevel', 'development', 'isDevelopment',
  );
  if(__TEST__) {
    isTestingURLParams.push('test', 'testing', 'isTest', 'isTesting');
  }
}
/// these must be 1-1, else we'll lose values when we reverse them
const appQueryToActionsMap = new Map([
    [ isTestingURLParams, appSlice.actions.setTesting ],
    [ isDevURLParams, appSlice.actions.setDevel ],
  ]),
  queryToActionsMap = new Map([
    [ 'displayEmpty', reportSlice.actions.setDisplayEmpty ],
    [ 'filter', reportSlice.actions.setFilter ],
    [ 'showTags', reportSlice.actions.setShowTags ],
    [ 'doAutoSelect', reportSlice.actions.setDoAutoSelect ],
  ]);
*/

const createBatchedActionCreatorWithSetURLQuery =
  (bareActionCreator, paramName) => paramVal => batchActions({
    originalAction: bareActionCreator(paramVal),
    additionalActions: [push].flatMap(routerAC => (getState, extra) => {
      const state = getState();
      if(paramVal !== getParsedSearchParamVal(state, paramName)) {
        const currLoc = getLocation(getState());
        const parsedSearch = getParsedSearchPure(currLoc.search);
        parsedSearch[paramName] = paramVal;
        const strSearch  = objToQueryString(parsedSearch);
        const newLoc = createLocation({ ...currLoc, search: strSearch });
        return routerAC(newLoc);
      }
      return null;
    }),
  });

export const bare_setDisplayEmptyWithURL =
  createBatchedActionCreatorWithSetURLQuery(
    bare_setDisplayEmpty,
    displayEmptyParam
  );

export const bare_setFilterWithURL =
  createBatchedActionCreatorWithSetURLQuery(
    bare_setFilter,
    filterParam
  );

export const bare_setShowTagsWithURL =
  createBatchedActionCreatorWithSetURLQuery(
    bare_setShowTags,
    showTagsParam
  );

export const bare_setDoAutoSelectWithURL =
  createBatchedActionCreatorWithSetURLQuery(
    bare_setDoAutoSelect,
    doAutoSelectParam
  );

export const bare_setTestingWithURL =
  createBatchedActionCreatorWithSetURLQuery(
    bare_setTesting,
    isTestingParam
  );

export const {
  setDisplayEmptyWithURL, setFilterWithURL, setShowTagsWithURL,
  setDoAutoSelectWithURL, setTestingWithURL,
} = wrapActionCreators({
  setDisplayEmptyWithURL: bare_setDisplayEmptyWithURL,
  setFilterWithURL: bare_setFilterWithURL,
  setShowTagsWithURL: bare_setShowTagsWithURL,
  setDoAutoSelectWithURL: bare_setDoAutoSelectWithURL,
  setTestingWithURL: bare_setTestingWithURL,
});
