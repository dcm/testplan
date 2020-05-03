// @ts-nocheck
/* eslint-disable max-len */
let USE_REACT_CONTEXT_FOR_STATE = false;
try {
  USE_REACT_CONTEXT_FOR_STATE = JSON.parse(
    process.env.REACT_APP_USE_REACT_CONTEXT_FOR_STATE
    || String(USE_REACT_CONTEXT_FOR_STATE),
  );
} catch(err) { }

if(USE_REACT_CONTEXT_FOR_STATE) {

  const uriQueryActionsMod = require('./react-context/uriQueryActions');
  const ReportActionsContextMod = require('./react-context/ReportActionsContext');
  const ReportStateContextMod = require('./react-context/ReportStateContext');
  const ReportStateProviderMod = require('./react-context/ReportStateProvider');
  const reducerMod = require('./react-context/reducer');
  module.exports = {
    actionChangeTypes: require('./react-context/actionChangeTypes'),
    actionCreators: require('./react-context/actionCreators').default,
    actionTypes: require('./react-context/actionTypes'),
    defaultState: require('./react-context/defaultState').default,
    reducer: reducerMod.default,
    hashQueryActionCreatorMap: uriQueryActionsMod.hashQueryActionCreatorMap,
    queryActionCreatorMap: uriQueryActionsMod.queryActionCreatorMap,
    ReportActionsContext: ReportActionsContextMod.default,
    useReportActionsContext: ReportActionsContextMod.useReportActionsContext,
    calculateChangedActionsBits: ReportActionsContextMod.calculateChangedBits,
    actionsMaskMap: ReportActionsContextMod.actionsMaskMap,
    ReportStateContext: ReportStateContextMod.default,
    useReportStateContext: ReportStateContextMod.useReportStateContext,
    calculateChangedStateBits: ReportStateContextMod.calculateChangedBits,
    stateMaskMap: ReportStateContextMod.stateMaskMap,
    ReportStateProvider: ReportStateProviderMod.default,
  };

} else {

  const {
    bare_mergeHeaders, bare_setAPIBaseURL, mergeHeaders, setAPIBaseURL,
    default: apiSlice,
  } = require('./react-redux/slices/apiSlice');
  const {
    bare_setDevel, bare_setTesting, bare_setDocumentationURL, setDevel,
    setTesting, setDocumentationURL, //default: appSlice,
  } = require('../../../state/appSlice');
  const {
    bare_setDoAutoSelect, bare_setShowTags, bare_setFilter,
    bare_setCenterPanelPlaceholderMessage, bare_setDisplayEmpty,
    bare_setFetchError, bare_setFetchErrorMessagePrelude, bare_setFetching,
    bare_setFetchingMessage, bare_setJsonReport, bare_setLoading,
    bare_setLoadingMessage, bare_setSelectedTestCase, bare_setShowHelpModal,
    bare_setShowInfoModal, setDoAutoSelect, setShowTags, setFilter,
    setCenterPanelPlaceholderMessage, setDisplayEmpty, setFetchError,
    setFetchErrorMessagePrelude, setFetching, setFetchingMessage, setJsonReport,
    setLoading, setLoadingMessage, setSelectedTestCase, setShowHelpModal,
    setShowInfoModal, default: reportSlice,
  } = require('./react-redux/slices/reportSlice');
  const {
    bare_setHashQuery, bare_setQuery, bare_setHashComponentAlias,
    bare_unsetHashComponentAliasByAlias,
    bare_unsetHashComponentAliasByComponent, setHashQuery, setQuery,
    setHashComponentAlias, unsetHashComponentAliasByAlias,
    unsetHashComponentAliasByComponent, default: uriSlice,
  } = require('./react-redux/slices/uriSlice');
  const { default: uiHistory } = require('./react-redux/uiHistory');
  const {
    getLocation, getSearch, default: AppStateProvider,
    getHash, connectRouter, CALL_HISTORY_METHOD, ConnectedRouter,
    createMatchSelector, getAction, LOCATION_CHANGE, onLocationChanged,
    routerActions, uiRouterMiddleware,
  } = require('./react-redux/UIStateProvider');
  const {
    setDisplayEmptyWithURL, setFilterWithURL, setShowTagsWithURL,
    setDoAutoSelectWithURL, setTestingWithURL,
    bare_setDisplayEmptyWithURL, bare_setFilterWithURL,
    bare_setShowTagsWithURL, bare_setDoAutoSelectWithURL,
    bare_setTestingWithURL,
  } = require('./react-redux/batchedActions');

  module.exports = {
    bare_mergeHeaders, bare_setAPIBaseURL, mergeHeaders, setAPIBaseURL,
    apiSlice, bare_setDevel, bare_setTesting, bare_setDocumentationURL,
    setDevel, setTesting, setDocumentationURL, /*appSlice,*/ bare_setDoAutoSelect,
    bare_setShowTags, bare_setFilter, bare_setCenterPanelPlaceholderMessage,
    bare_setDisplayEmpty, bare_setFetchError, bare_setFetchErrorMessagePrelude,
    bare_setFetching, bare_setFetchingMessage, bare_setJsonReport,
    bare_setLoading, bare_setLoadingMessage, bare_setSelectedTestCase,
    bare_setShowHelpModal, bare_setShowInfoModal, setDoAutoSelect, setShowTags,
    setFilter, setCenterPanelPlaceholderMessage, setDisplayEmpty, setFetchError,
    setFetchErrorMessagePrelude, setFetching, setFetchingMessage, setJsonReport,
    setLoading, setLoadingMessage, setSelectedTestCase, setShowHelpModal,
    setShowInfoModal, reportSlice, bare_setHashQuery, bare_setQuery,
    bare_setHashComponentAlias, bare_unsetHashComponentAliasByAlias,
    bare_unsetHashComponentAliasByComponent, setHashQuery, setQuery,
    setHashComponentAlias, unsetHashComponentAliasByAlias,
    unsetHashComponentAliasByComponent, uriSlice, getLocation, getSearch,
    AppStateProvider, uiHistory, getHash, connectRouter,
    CALL_HISTORY_METHOD, ConnectedRouter, createMatchSelector, getAction,
    LOCATION_CHANGE, onLocationChanged, routerActions, uiRouterMiddleware,
    setDisplayEmptyWithURL, setFilterWithURL, setShowTagsWithURL,
    setDoAutoSelectWithURL, setTestingWithURL, bare_setDisplayEmptyWithURL,
    bare_setFilterWithURL, bare_setShowTagsWithURL, bare_setDoAutoSelectWithURL,
    bare_setTestingWithURL,
  };

}
