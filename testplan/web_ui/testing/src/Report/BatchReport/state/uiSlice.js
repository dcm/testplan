import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import withErrorEntry from '../../../state/utils-detat/withErrorEntry';
import * as filterStates from '../utils/filterStates';

/** This state slice contains information specific to how the UI should look */
export default createSlice({
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
    setShowTags: {
      reducer(state, { payload }) {
        state.isShowTags = payload;
      },
      // @ts-ignore
      prepare: (showTags = false) => ({
        payload: !!showTags
      }),
    },
    setShowInfoModal: {
      reducer(state, { payload }) {
        state.isShowInfoModal = payload;
      },
      // @ts-ignore
      prepare: (showInfoModal = false) => ({
        payload: !!showInfoModal
      }),
    },
    setDoAutoSelect: {
      reducer(state, { payload }) {
        state.doAutoSelect = payload;
      },
      // @ts-ignore
      prepare: (doAutoSelect = true) => ({
        payload: !!doAutoSelect
      }),
    },
    setFilter: {
      reducer(state, { payload }) {
        state.filter = payload;
      },
      // @ts-ignore
      prepare: (filter = filterStates.ALL) => {
        if(!(filter in Object.values(filterStates))) {
          filter = filterStates.ALL;
        }
        return {
          payload: `${filter}`
        };
      },
    },
    setDisplayEmpty: {
      reducer(state, { payload }) {
        state.isDisplayEmpty = payload;
      },
      // @ts-ignore
      prepare: (displayEmpty = true) => ({
        payload: !!displayEmpty
      }),
    },
    setShowHelpModal: {
      reducer(state, { payload }) {
        state.isShowHelpModal = payload;
      },
      // @ts-ignore
      prepare: (showHelpModal = false) => ({
        payload: !!showHelpModal
      }),
    },
  },
});
