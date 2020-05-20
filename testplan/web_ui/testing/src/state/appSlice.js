import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import * as appHistoryActions  from './appHistory/actions';
import withErrorEntry from './utils-detat/withErrorEntry';
import { setSimplePayloadWithError } from './utils-detat/setStateSimple';
import { setSimplePayload } from './utils-detat/setStateSimple';

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
const appSlice = createSlice({
  name: 'app',
  initialState: withErrorEntry({
    isTesting: false,
    isDevel: false,
    documentationURL: 'http://testplan.readthedocs.io/',
    apiBaseURL: API_BASE_URL.toString(),
    apiHeaders:  {
      ...API_CORS_HEADERS,
      'Accept': 'application/json',
      'Accept-Charset': 'utf-8',
    },
  }),
  extraReducers: {
    /* eslint-disable max-len */
    [appHistoryActions.setIsTesting.fulfilled]: setSimplePayload('isTesting'),
    [appHistoryActions.setIsTesting.rejected]: setSimplePayloadWithError('isTesting'),
    [appHistoryActions.setIsDevel.fulfilled]: setSimplePayload('isDevel'),
    [appHistoryActions.setIsDevel.rejected]: setSimplePayloadWithError('isDevel'),
    /* eslint-enable max-len */
  },
});

export default appSlice;
