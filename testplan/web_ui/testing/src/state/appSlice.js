import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';

const __DEV__ = process.env.NODE_ENV !== 'production';
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_BASE_URL =
  __DEV__ && REACT_APP_API_BASE_URL !== undefined
    ? new URL(REACT_APP_API_BASE_URL)
    : new URL('/api/v1', window.location.origin);

// CORS headers: developer.mozilla.org/en-US/docs/Web/HTTP/CORS
const API_CORS_HEADERS =
  window.location.origin !== API_BASE_URL.origin
    ? { 'Access-Control-Allow-Origin': API_BASE_URL.origin }
    : {};

/**
 * This state slice contains app-wide information that could be used in any
 * part of the app
 */
export default createSlice({
  name: 'app',
  initialState: {
    isTesting: false,
    isDevel: false,
    documentationURL: 'http://testplan.readthedocs.io/',
    apiBaseURL: API_BASE_URL.toString(),
    apiHeaders:  {
      ...API_CORS_HEADERS,
      'Accept': 'application/json',
      'Accept-Charset': 'utf-8',
    },
  },
  reducers: {
    setIsDevel: {
      reducer(state, { payload }) {
        state.isDevel = payload;
      },
      // @ts-ignore
      prepare: (isDevel = false) => ({
        payload: !!isDevel
      }),
    },
    setIsTesting: {
      reducer(state, { payload }) {
        state.isTesting = payload;
      },
      // @ts-ignore
      prepare: (isTesting = false) => ({
        payload: !!isTesting
      }),
    },
  },
});
