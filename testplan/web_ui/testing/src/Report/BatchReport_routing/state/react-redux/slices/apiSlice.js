import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import wrapActionCreators from 'react-redux/es/utils/wrapActionCreators';
import axios from 'axios';

const __DEV__ = process.env.NODE_ENV !== 'production';

const apiSlice = createSlice({
  name: 'api',
  initialState: (() => {
    const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const API_BASE_URL = __DEV__ && REACT_APP_API_BASE_URL !== undefined
      ? new URL(REACT_APP_API_BASE_URL)
      : new URL('/api/v1', window.location.origin);
    const API_CORS_HEADERS = window.location.origin !== API_BASE_URL.origin
      ? { 'Access-Control-Allow-Origin': API_BASE_URL.origin }
      : {};
    return {
      /** @type {string} */
      baseURL: API_BASE_URL.toString(),
      /** @type {Object.<string, string>} */
      headers: {
        ...axios.defaults.headers.common,
        Accept: 'application/json',
        ...API_CORS_HEADERS,
      },
    };
  })(),
  reducers: {
    /**
     * @param {object} state
     * @param {object} action
     * @param {string | URL} action.payload
     */
    setAPIBaseURL: {
      reducer(state, { payload: newURL }) {
        let newURLObj = newURL;
        if(!(newURLObj instanceof URL)) {  // validation
          newURLObj = new URL(newURL);  // throws error if invalid url
        }
        state.baseURL = newURLObj.toString();
      },
      prepare: (newURL) => ({ payload: newURL }),
    },
    /**
     * Adds additional headers to the default headers stored in the state.
     * If a header is already in the state it is replaced, and if any of the
     * passed-in headers' value is `undefined` that header is deleted from
     * the state.
     */
    mergeHeaders: {
      reducer(state, { payload: headers }) {
        for(const [ key, val ] of Object.entries(headers)) {
          if(typeof val === 'undefined') {
            delete state.headers[key];
          } else {
            state.headers[key] = `${val}`;
          }
        }
      },
      prepare: (headers) => ({ payload: headers }),
    },
  },
});

export const {
  mergeHeaders: bare_mergeHeaders,
  setAPIBaseURL: bare_setAPIBaseURL,
} = apiSlice.actions;
export const {
  mergeHeaders,
  setAPIBaseURL
} = wrapActionCreators(apiSlice.actions);
export default apiSlice;
