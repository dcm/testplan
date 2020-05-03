import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import wrapActionCreators from 'react-redux/es/utils/wrapActionCreators';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    isTesting: false,
    isDevel: false,
    documentationURL: 'http://testplan.readthedocs.io',
  },
  reducers: {
    /**
     * @param {object} state
     * @param {object} action
     * @param {string | URL} action.payload
     */
    setDocumentationURL: {
      reducer(state, { payload: url }) {
        state.documentationURL = url;
      },
      prepare: (url) => ({ payload: url }),
    },
    setTesting: {
      reducer(state, { payload: boolable }) {
        state.isTesting = !!boolable;
      },
      prepare: (boolable) => ({ payload: boolable }),
    },
    setDevel: {
      reducer(state, { payload: boolable }) {
        state.isDevel = !!boolable;
      },
      prepare: (boolable) => ({ payload: boolable }),
    },
  },
});

export const {
  setDevel: bare_setDevel,
  setTesting: bare_setTesting,
  setDocumentationURL: bare_setDocumentationURL,
} = appSlice.actions;
export const {
  setDevel,
  setTesting,
  setDocumentationURL
} = wrapActionCreators(appSlice.actions);
export default appSlice;
