
export const mkGetHashAliasToComponent = () =>
  state => state.hashAliasToComponent;
export const getHashAliasToComponent =
  mkGetHashAliasToComponent();

export const mkGetHashComponentToAlias = () =>
  state => state.hashComponentToAlias;
export const getHashComponentToAlias =
  mkGetHashComponentToAlias();

export const mkGetIsShowHelpModal = () =>
  state => state.isShowHelpModal;
export const getIsShowHelpModal =
  mkGetIsShowHelpModal();

export const mkGetIsDisplayEmpty = () =>
  state => state.isDisplayEmpty;
export const getIsDisplayEmpty =
  mkGetIsDisplayEmpty();

export const mkGetCenterPanelPlaceholderMessage = () =>
  state => state.centerPanelPlaceholderMessage;
export const getCenterPanelPlaceholderMessage =
  mkGetCenterPanelPlaceholderMessage();

export const mkGetFilter = () =>
  state => state.filter;
export const getFilter =
  mkGetFilter();

export const mkGetIsFetching = () =>
  state => state.isFetching;
export const getIsFetching =
  mkGetIsFetching();

export const mkGetIsFetchingMessage = () =>
  state => state.isFetchingMessage;
export const getIsFetchingMessage =
  mkGetIsFetchingMessage();

export const mkGetIsLoading = () =>
  state => state.isLoading;
export const getIsLoading =
  mkGetIsLoading();

export const mkGetIsLoadingMessage = () =>
  state => state.isLoadingMessage;
export const getIsLoadingMessage =
  mkGetIsLoadingMessage();

export const mkGetFetchError = () =>
  state => state.fetchError;
export const getFetchError =
  mkGetFetchError();

export const mkGetFetchErrorMessagePrelude = () =>
  state => state.fetchErrorMessagePrelude;
export const getFetchErrorMessagePrelude =
  mkGetFetchErrorMessagePrelude();

export const mkGetIsShowTags = () =>
  state => state.isShowTags;
export const getIsShowTags =
  mkGetIsShowTags();

export const mkGetJsonReport = () =>
  state => state.jsonReport;
export const getJsonReport =
  mkGetJsonReport();

export const mkGetIsShowInfoModal = () =>
  state => state.isShowInfoModal;
export const getIsShowInfoModal =
  mkGetIsShowInfoModal();

export const mkGetSelectedTestCase = () =>
  state => state.selectedTestCase;
export const getSelectedTestCase =
  mkGetSelectedTestCase();

export const mkGetDoAutoSelect = () =>
    state => state.doAutoSelect;
export const getDoAutoSelect =
  mkGetDoAutoSelect();
