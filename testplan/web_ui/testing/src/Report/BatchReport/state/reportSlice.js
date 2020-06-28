// @ts-nocheck
import _isObject from 'lodash/isObject';
import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import fetchReport, { REPORT_FETCH_CANCEL } from './reportActions/fetchReport';

const DEFAULT_TIMEOUT = 3_000;
const DEFAULT_MAX_CONTENT_LENGTH = Infinity;
const INIT_PROGRESS = { loaded: 0, total: -1, lengthComputable: false };

export default createSlice({
  name: 'report',
  initialState: {
    uid: null,
    document: null,
    isFetching: false,
    isFetchCancelled: false,
    fetchError: null,
    maxContentLength: DEFAULT_MAX_CONTENT_LENGTH,
    fetchTimeout: DEFAULT_TIMEOUT,
    downloadProgress: INIT_PROGRESS,
  },
  reducers: {
    setMaxContentLength: {
      reducer(state, { payload }) { state.maxContentLength = payload; },
      prepare: (length = DEFAULT_MAX_CONTENT_LENGTH) => ({ payload: length }),
    },
    setDownloadProgress: {
      reducer(state, { payload }) { state.downloadProgress = payload; },
      prepare: (progress = INIT_PROGRESS) => ({ payload: progress }),
    },
    setReportUID: {
      reducer(state, { payload }) { state.uid = payload; },
      prepare: (uid = null) => ({ payload: uid }),
    },
    setFetchTimeout: {
      reducer(state, { payload }) { state.fetchTimeout = payload; },
      prepare: (timeout = DEFAULT_TIMEOUT) => ({ payload: timeout }),
    },
  },
  extraReducers: {
    [fetchReport.pending.type](state) {
      state.isFetching = true;
      state.isFetchCancelled = false;
    },
    [fetchReport.fulfilled.type](state, action) {
      state.isFetching = false;
      state.isFetchCancelled = false;
      state.fetchError = null;
      state.document = action.payload;
    },
    [fetchReport.rejected.type](state, action) {
      state.isFetching = false;
      if(_isObject(action.error) && action.error.message === 'Rejected') {
        // handled with rejectWithValue
        const { payload: rejectValue } = action;
        if(rejectValue === REPORT_FETCH_CANCEL) {
          state.isFetchCancelled = true;
        } else {
          state.fetchError = rejectValue;
          state.isFetchCancelled = false;
        }
      } else {
        state.fetchError = action.error;
        state.isFetchCancelled = false;
      }
    },
  },
});
