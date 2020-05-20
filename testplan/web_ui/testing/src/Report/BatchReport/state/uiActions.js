import uiSlice from './uiSlice';

export * as uiHistoryActions from './uiHistory/actions';
export const {
  setHashComponentAlias,
  unsetHashComponentAliasByAlias,
  unsetHashComponentAliasByComponent,
  setFetching,
  setLoading,
  setFetchError,
  setJsonReport,
  setSelectedTestCase,
  setDoAutoSelect,
  setShowTags,
  setFilter,
  setDisplayEmpty,
  setShowHelpModal,
  setShowInfoModal,
} = uiSlice.actions;
