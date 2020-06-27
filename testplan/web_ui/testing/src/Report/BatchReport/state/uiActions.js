import uiSlice from './uiSlice';

export const {
  setShowTags,
  setShowInfoModal,
  setDoAutoSelect,
  setFilter,
  setDisplayEmpty,
  setShowHelpModal,
  setHashComponentAlias,
  unsetHashComponentAliasByAlias,
  unsetHashComponentAliasByComponent,
  setSelectedTestCase,
} = uiSlice.actions;
