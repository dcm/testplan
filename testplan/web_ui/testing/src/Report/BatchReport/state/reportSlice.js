import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import * as Signals from './reportWorker/signals';
import { RUN_FETCH_PENDING_ACTION_TYPE } from './reportWorker/runFetch';
import { RUN_FETCH_FULFILLED_ACTION_TYPE } from './reportWorker/runFetch';
import { RUN_FETCH_REJECTED_ACTION_TYPE } from './reportWorker/runFetch';
import { hibit } from '../../../Common/utils';

/**
 * @typedef {object} BasicAuthCredentials
 * @property {string} username
 * @property {string} password
 */
/**
 * @typedef {object} ProxyConfiguration<T>
 * @property {string} host
 * @property {number} port
 * @property {BasicAuthCredentials} [auth=undefined]
 */

const isNil = val => val === null || val === undefined || isNaN(val);

const trimToByteHighs = stage => 0
  | hibit(stage & Signals.ERROR_MASK)
  | hibit(stage & Signals.FETCH_STAGE_MASK)
  | hibit(stage & Signals.PROCESS_STAGE_MASK)
  | hibit(stage & Signals.SETTINGS_MASK);

const setError = (state, meta, error) => {
  if(!isNil(error)) {
    state._errors.push({
      ...meta,
      error,
      stage: state.stage,
    });
    state.lastFetchError = error;
  }
};

const INIT_PROGRESS = {
  loaded: 0,
  total: -1,
  lengthComputable: false,
};

/**
 * Make an error serializable by extracting its important info.
 * @param {Error | undefined | null} error
 * @returns {undefined | null | { name: string; message: string; stack: string; }}
 */
function objectifyError(error) {
  if(!(error instanceof Error)) {
    if(error !== null || typeof error !== 'undefined') {
      return null;
    }
    return error;
  }
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
}

export default createSlice({
  name: 'report',
  initialState: {
    uid: null,
    document: {},
    stage: Signals.NEVERRAN,
    isFetching: false,
    fetchTimeout: 3_000,
    fetchAttempts: 0,
    lastFetchError: null,
    downloadProgress: INIT_PROGRESS,
    /** @type {null | BasicAuthCredentials} */
    basicAuthCredentials: null,
    /** @type {null | ProxyConfiguration} */
    proxyConfiguration: null,
    apiReportsSubpath: 'reports',
    _errors: [],
  },
  reducers: {
    setDownloadProgress: {
      reducer(state, { payload, error, meta }) {
        state.downloadProgress = payload;
        setError(state, meta, error);
      },
      /**
       * @param {ProgressEvent} evt
       * @param {Error | null} error
       */
      prepare({ lengthComputable, loaded, total }, error = null) {
        return {
          error: objectifyError(error),
          payload: {
            lengthComputable,
            loaded,
            total,
          },
          meta: {
            time: Date.now(),
          },
        };
      }
    },
    setReportUID: {
      reducer(state, action) {
        state.uid = action.payload;
      },
      prepare(uid) {
        return {
          payload: uid,
        };
      },
    },
    setProxyConfiguration: {
      reducer(state, action) {
        state.proxyConfiguration = action.payload;
      },
      // @ts-ignore
      prepare(host, port, { username = null, password = null }) {
        const payload = { host };
        if(typeof port === 'string') payload.port = parseInt(port);
        if(username !== null && password !== null) {
          payload.auth = {
            username,
            password,
          };
        }
        return payload;
      }
    },
    setBasicAuthCredentials: {
      reducer(state, { payload: { username, password } }) {
        state.basicAuthCredentials = {
          username,
          password,
        };
      },
      prepare(username, password) {
        return {
          payload: {
            username,
            password,
          },
        };
      }
    },
    updateFetchStatus: {
      reducer(state, { meta, payload: bitmask, error }) { 
        state.stage |= bitmask;
        setError(state, meta, error);
      },
      prepare(bitmask, error) {
        return {
          payload: bitmask,
          error: objectifyError(error),
          meta: {
            time: Date.now(),
          },
        };
      },
    },
    setFetchStatus: {
      reducer(state, { meta, payload: bitmask, error }) { 
        state.stage = bitmask;
        setError(state, meta, error);
      },
      prepare(bitmask, error) { 
        return {
          payload: bitmask,
          error: objectifyError(error),
          meta: {
            time: Date.now(),
          },
        };
      },
    },
    setDocument: {
      reducer(state, { meta, payload, error }) {
        state.document = payload;
        setError(state, meta, error);
      },
      prepare(document, error) {
        return {
          payload: document,
          error: objectifyError(error),
          meta: {
            time: Date.now(),
          },
        };
      },
    },
  },
  extraReducers: {
    [RUN_FETCH_PENDING_ACTION_TYPE](state, action) {
      state.isFetching = true;
      state.fetchAttempts++;
      state.downloadProgress = INIT_PROGRESS;
    },
    [RUN_FETCH_FULFILLED_ACTION_TYPE](state, action) {
      state.isFetching = false;
      state.stage = trimToByteHighs(state.stage);
      state.lastFetchError = null;
    },
    [RUN_FETCH_REJECTED_ACTION_TYPE](state, { meta, payload, error }) {
      state.isFetching = false;
      state.stage = trimToByteHighs(state.stage);
      setError(state, meta, error);
      state.lastFetchError = isNil(error) ? null : error;
    },
  },
});
