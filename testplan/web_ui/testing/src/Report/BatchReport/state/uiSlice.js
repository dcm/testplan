import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import withErrorEntry from '../../../state/utils-detat/withErrorEntry';
import { uiRouterReducer } from './UIRouter';
import * as filterStates from '../utils/filterStates';
import { setShowTags } from './UIRouter';
import { setShowInfoModal } from './UIRouter';
import { setDoAutoSelect } from './UIRouter';
import { setFilter } from './UIRouter';
import { setDisplayEmpty } from './UIRouter';
import { setShowHelpModal } from './UIRouter';

/** This state slice contains information specific to how the UI should look */
const uiSlice = createSlice({
  name: 'ui',
  initialState: withErrorEntry({
    hashAliasToComponent: {},
    hashComponentToAlias: {},
    isShowHelpModal: false,
    isDisplayEmpty: true,
    filter: filterStates.ALL,
    isShowTags: false,
    isShowInfoModal: false,
    selectedTestCase: null,
    doAutoSelect: true,
  }),
  reducers: {
    router: uiRouterReducer,
    setHashComponentAlias: {
      reducer(state, { payload: aliasToComponentMap }) {
        for(const [ alias, component ] of Object.entries(aliasToComponentMap)) {
          state.hashAliasToComponent[alias] = component;
          state.hashComponentToAlias[component] = alias;
        }
      },
      // @ts-ignore
      prepare: aliasToComponentMap => ({
        payload: aliasToComponentMap
      }),
    },
    unsetHashComponentAliasByAlias: {
      reducer(state, { payload: aliases }) {
        for(const _alias of aliases) {
          const component = state.hashAliasToComponent[_alias];
          delete state.hashComponentToAlias[component];
          delete state.hashAliasToComponent[_alias];
        }
      },
      // @ts-ignore
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
      // @ts-ignore
      prepare: (components = []) => ({
          payload: Array.isArray(components) ? components : [ components ],
      }),
    },
    setSelectedTestCase: {
      reducer(state, { payload }) {
        state.selectedTestCase = payload;
      },
      // @ts-ignore
      prepare: message => ({
        payload: message
      }),
    },
  },
  extraReducers: {
    [setShowTags.type](state, action) {
      state.isShowTags = !!action.payload;
    },
    [setShowInfoModal.type](state, action) {
      state.isShowInfoModal = !!action.payload;
    },
    [setDoAutoSelect.type](state, action) {
      state.doAutoSelect = !!action.payload;
    },
    [setFilter.type](state, action) {
      state.filter = `${action.payload}`;
    },
    [setDisplayEmpty.type](state, action) {
      state.isDisplayEmpty = !!action.payload;
    },
    [setShowHelpModal.type](state, action) {
      state.isShowHelpModal = !!action.payload;
    },
  },
});

export default uiSlice;
