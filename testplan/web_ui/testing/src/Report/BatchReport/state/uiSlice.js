import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import withErrorEntry from '../../../state/utils-detat/withErrorEntry';
import {
  setSimplePayloadWithError
} from '../../../state/utils-detat/setStateSimple';
import { setSimplePayload } from '../../../state/utils-detat/setStateSimple';
import { setError } from '../../../state/utils-detat/setStateSimple';
import * as filterStates from '../utils/filterStates';
import * as uiHistoryActions from './uiHistory/actions';

const __DEV__ = process.env.NODE_ENV !== 'production';

/** This state slice contains information specific to how the UI should look */
const uiSlice = createSlice({
  name: 'ui',
  initialState: withErrorEntry({
    hashAliasToComponent: {},
    hashComponentToAlias: {},
    isShowHelpModal: false,
    isDisplayEmpty: true,
    filter: filterStates.ALL,
    isFetching: false,
    isLoading: false,
    fetchError: null,
    isShowTags: false,
    jsonReport: null,
    isShowInfoModal: false,
    selectedTestCase: null,
    doAutoSelect: true,
  }),
  reducers: {
    setHashComponentAlias: {
      reducer(state, { payload: aliasToComponentMap }) {
        for(const [ alias, component ] of Object.entries(aliasToComponentMap)) {
          state.hashAliasToComponent[alias] = component;
          state.hashComponentToAlias[component] = alias;
        }
      },
      prepare: aliasToComponentMap => ({ payload: aliasToComponentMap }),
    },
    unsetHashComponentAliasByAlias: {
      reducer(state, { payload: aliases }) {
        for(const _alias of aliases) {
          const component = state.hashAliasToComponent[_alias];
          delete state.hashComponentToAlias[component];
          delete state.hashAliasToComponent[_alias];
        }
      },
      prepare: (aliases = []) => ({
        payload: Array.isArray(aliases) ? aliases : [ aliases ],
      }),
    },
    unsetHashComponentAliasByComponent: {
      reducer(state, { payload: components }) {
        for(const _component of components) {
          const alias = state.hashComponentToAlias[_component];
          delete state.hashAliasToComponent[alias];
          delete state.hashComponentToAlias[_component];
        }
      },
      prepare: (components = []) => ({
          payload: Array.isArray(components) ? components : [ components ],
      }),
    },
    setCenterPanelPlaceholderMessage: {
      reducer(state, { payload }) {
        state.centerPanelPlaceholderMessage = payload;
      },
      prepare: message => ({ payload: `${message}` }),
    },
    setFetching: {
      reducer(state, { payload }) { state.isFetching = payload; },
      prepare: boolable => ({ payload: !!boolable }),
    },
    setFetchingMessage: {
      reducer(state, { payload }) { state.isFetchingMessage = payload; },
      prepare: message => ({ payload: `${message}` }),
    },
    setLoading: {
      reducer(state, { payload }) { state.isLoading = payload; },
      prepare: boolable => ({ payload: !!boolable }),
    },
    setLoadingMessage: {
      reducer(state, { payload }) { state.isLoadingMessage = payload; },
      prepare: message => ({ payload: `${message}` }),
    },
    setFetchError: {
      reducer(state, { payload: error = null }) {
        state.fetchError = (error instanceof Error) ?
          (`${error.message}` + (__DEV__ ? `\n${error.stack}` : ''))
          : (typeof error === 'string') ? error
            : (error === undefined || error === null) ? null
              : `${error}`;
      },
      prepare: error => ({ payload: error }),
    },
    setFetchErrorMessagePrelude: {
      reducer(state, { payload }) {
        state.fetchErrorMessagePrelude = payload;
      },
      prepare: prelude => ({ payload: `${prelude}` }),
    },
    setJsonReport: {
      reducer(state, { payload }) { state.jsonReport = payload; },
      prepare: jsonReport => ({ payload: jsonReport }),
    },
    setSelectedTestCase: {
      reducer(state, { payload }) { state.selectedTestCase = payload; },
      prepare: message => ({ payload: message }),
    },
  },
  extraReducers: {
    /* eslint-disable max-len */
    [uiHistoryActions.setShowInfoModal.rejected](state, action) {
      setError('showInfoModal')(state, action);
      // something went wrong so force-unshow the modal cuz it could be covering
      // what went wrong
      state.showInfoModal = false;
    },
    [uiHistoryActions.setShowInfoModal.fulfilled](state, { payload }) {
      state.isShowInfoModal = payload;
      if(!!payload === true) {  // if this is true the ensure no other modals are showing
        state.isShowHelpModal = false;
      }
    },
    [uiHistoryActions.setShowHelpModal.rejected](state, action) {
      setError('showHelpModal')(state, action);
      // something went wrong so force-unshow the modal cuz it could be covering
      // what went wrong
      state.showHelpModal = false;
    },
    [uiHistoryActions.setShowHelpModal.fulfilled](state, { payload }) {
      state.isShowHelpModal = payload;
      if(!!payload === true) {  // if this is true the ensure no other modals are showing
        state.isShowInfoModal = false;
      }
    },
    [uiHistoryActions.setShowTags.fulfilled]: setSimplePayload('showTags'),
    [uiHistoryActions.setShowTags.rejected]: setSimplePayloadWithError('showTags'),
    [uiHistoryActions.setFilter.fulfilled]: setSimplePayload('filter'),
    [uiHistoryActions.setFilter.rejected]: setSimplePayloadWithError('filter'),
    [uiHistoryActions.setDisplayEmpty.fulfilled]: setSimplePayload('displayEmpty'),
    [uiHistoryActions.setDisplayEmpty.rejected]: setSimplePayloadWithError('displayEmpty'),
    [uiHistoryActions.setDoAutoSelect.fulfilled]: setSimplePayload('doAutoSelect'),
    [uiHistoryActions.setDoAutoSelect.rejected]: setSimplePayloadWithError('doAutoSelect'),
    /* eslint-enable max-len */
  },
});

export default uiSlice;
