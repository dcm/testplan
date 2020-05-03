import { createSelector } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import immerStructure from '../../../../../state/struct/immerStructure';
import createSelectors from 'connected-react-router/esm/selectors';
import { queryStringToEntriesGenerator } from '../../../../../Common/utils';
// import * as uriSpySettings from './uriSpy.settings';

/** @typedef {any |string |number |boolean |null |symbol |BigInt} ActuallyAny */
/**
 * @typedef {object} SynchronizationState
 * @property {Array<{ type: string, id: string }>} pendingActions
 */

export const {
  getLocation,
  getAction,
  getHash,
  getSearch,
  createMatchSelector,
} = createSelectors(immerStructure);

export const getParsedSearchPure = search => {
  /** @type {Object.<string, any[]>} */
  const parsedObj = {}, qsGenEntries = queryStringToEntriesGenerator(search);
  if(search)
    for(const [ param, val ] of qsGenEntries) parsedObj[param] = val;
  return parsedObj;
};

export const getParsedSearch = createSelector(getSearch, getParsedSearchPure);

export const getParsedSearchParamValPure = createSelector(
  getParsedSearchPure,
  (searchObj, param) => searchObj[param],
);

export const getParsedSearchParamVal = createSelector(
  getParsedSearch,
  (searchObj, param) => searchObj[param],
);

// export const getUriSpyHashSettings = () => uriSpySettings.hash;

export const getApiState = state => state.api;
export const getAppState = state => state.app;
export const getReportState = state => state.report;
export const getUriState = state => state.uri;
export const getRouterState = state => state.router;

/**
 * @param {{ synchronization: SynchronizationState }} state
 * @returns {SynchronizationState}
 */
export const getSynchronizationState = state => state.synchronization;
export const getRegisteredPendingActions = createSelector(
  getSynchronizationState,
  synchronizationState => synchronizationState.pendingActions
);
export const getRegisteredPendingActionsForId = createSelector(
  getRegisteredPendingActions,
  (pendingActions, { id }) =>
    pendingActions.filter(regd => regd.id === id)
);
export const getRegisteredPendingActionsForType = createSelector(
  getRegisteredPendingActions,
  (pendingActions, { type }) =>
    pendingActions.filter(regd => regd.type === type)
);
export const getRegisteredPendingActionsForIdType = createSelector(
  getRegisteredPendingActionsForId,
  getRegisteredPendingActionsForType,
  (filteredById, filteredByType, { id, type }) =>
    filteredById.filter(regd => regd.type === type).concat(
      filteredByType.filter(regd => regd.id === id)
    )
);
