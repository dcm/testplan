import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import wrapActionCreators from 'react-redux/es/utils/wrapActionCreators';

function prepareQuery({ search: queryString }) {
  const payload = {};
  const error = {};
  const params = new URLSearchParams(queryString);
  for(const [ qKey, qVal ] of params.entries()) {
    try {
      payload[qKey] = JSON.parse(qVal);
    } catch(err) {
      error[qKey] = qVal;
    }
  }
  return { error, payload, meta: Date.now() };
}

const uriSlice = createSlice({
  name: 'uri',
  initialState: {
    /** @type {Object.<string, string>} */
    hashAliasToComponent: {},
    /**
     * Faster lookups with a mirrored mapping
     * @type {Object.<string, string>}
     */
    hashComponentToAlias: {},
    /** @type {Object.<string, any>} */
    hashQuery: {},
    /** @type {Object.<string, any>} */
    query: {},
    errors: {
      /** @type {Object.<number, Object.<string, string>>} */
      hashComponentAliases: {},
      /** @type {Object.<number, Object.<string, string>>} */
      hashQuery: {},
      /** @type {Object.<number, Object.<string, string>>} */
      query: {},
    },
  },
  reducers: {
    setQuery: {
      reducer(state, { payload: parsedQuery, error: parseErrors, meta: time }) {
        state.query = parsedQuery;
        state.errors.query[time] = parseErrors;  // TODO: Do smth with these
      },
      prepare: prepareQuery,
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {object} action.payload
     */
    setHashQuery: {
      reducer(state, { payload: parsedQuery, error: parseErrors, meta: time }) {
        state.hashQuery = parsedQuery;
        state.errors.hashQuery[time] = parseErrors;
      },
      prepare: prepareQuery,
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {object} action.payload
     */
    setHashComponentAlias: {
      reducer(state, { payload: aliasToComponentMap }) {
        for(const [ alias, component ] of Object.entries(aliasToComponentMap)) {
          state.hashAliasToComponent[alias] = component;
          state.hashComponentToAlias[component] = alias;
        }
      },
      prepare: (aliasToComponentMap) => ({ payload: aliasToComponentMap }),
    },
    unsetHashComponentAliasByAlias: {
      /**
       * @param {object} state
       * @param {object} action
       * @param {string[]} action.payload
       */
      reducer(state, { payload: aliases }) {
        for(const _alias of aliases) {
          const component = state.hashAliasToComponent[_alias];
          delete state.hashComponentToAlias[component];
          delete state.hashAliasToComponent[_alias];
        }
      },
      /**
       * @param {string | string[]} aliases
       * @returns {{ payload: string[] }}
       */
      prepare: (aliases = []) => ({
        payload: Array.isArray(aliases) ? aliases : [ aliases ],
      }),
    },
    unsetHashComponentAliasByComponent: {
      /**
       * @param {object} state
       * @param {object} action
       * @param {string[]} action.payload
       */
      reducer(state, { payload: components }) {
        for(const _component of components) {
          const alias = state.hashComponentToAlias[_component];
          delete state.hashAliasToComponent[alias];
          delete state.hashComponentToAlias[_component];
        }
      },
      /**
       * @param {string | string[]} components
       * @returns {{ payload: string[] }}
       */
      prepare: (components = []) => ({
        payload: Array.isArray(components) ? components : [ components ],
      }),
    },
  },
});

export const {
  setHashQuery: bare_setHashQuery,
  setQuery: bare_setQuery,
  setHashComponentAlias: bare_setHashComponentAlias,
  unsetHashComponentAliasByAlias: bare_unsetHashComponentAliasByAlias,
  unsetHashComponentAliasByComponent: bare_unsetHashComponentAliasByComponent,
} = uriSlice.actions;
export const {
  setHashQuery,
  setQuery,
  setHashComponentAlias,
  unsetHashComponentAliasByAlias,
  unsetHashComponentAliasByComponent,
} = wrapActionCreators(uriSlice.actions);
export default uriSlice;
