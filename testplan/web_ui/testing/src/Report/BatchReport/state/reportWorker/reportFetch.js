/// <reference lib="webworker" />
/// <reference lib="dom" />
/* global globalThis */
/* eslint-disable no-restricted-globals */
/* eslint-env worker,browser */
import Axios from 'axios/lib/core/Axios';
const __DEV__ = process.env.NODE_ENV !== 'production';
const IS_THREAD = self.constructor.name.endsWith('WorkerGlobalScope');
const REPORT_UID_OVERRIDE = process.env.REACT_APP_REPORT_UID_OVERRIDE;
const FAKE_REPORT_ASSERTIONS_RELPATH =
  '../../../../__tests__/mocks/documents/fakeReportAssertions.json';
class TimeoutError extends Error {}
class AbortError extends Error {}
const BENIGN_JUMP = 'BENIGN_JUMP';
const END = 'END';
const isFunc = v => typeof v === 'function';

/**
 * @typedef {object} BasicAuthCredentials
 * @property {string} username
 * @property {string} password
 */
/**
 * @typedef {object} ProxyConfiguration
 * @property {string} host
 * @property {number} port
 * @property {BasicAuthCredentials} [auth=undefined]
 */
/**
 * @typedef ActuallyAny
 * @type { any | string | number | boolean | null | symbol | BigInt}
 */
/**
 * @template T, R
 * @callback Func0<T, R>
 * @param {Array<T>} args
 * @returns {Promise<R>}
 */
/**
 * @template T, R
 * @callback Func1<T, R>
 * @param {string} method
 * @returns {Func0<T, R>}
 */
/**
 * @template T, R
 * @callback Func2<T, R>
 * @param {AbortSignal} signal
 * @returns {Func1<T, R>}
 */
/**
 * @typedef {Object} FetchReportConfig
 * @property {import('axios').default} Axios
 * @property {null | BasicAuthCredentials} basicAuthCredentials
 * @property {null | ProxyConfiguration} proxyConfiguration
 * @property {string} reportUid
 * @property {number} fetchTimeout
 * @property {import('axios').CancelToken} cancelToken
 * @property {boolean} isDevel
 * @property {boolean} isTesting
 * @property {object} apiHeaders
 * @property {string} apiReportsBaseUrl
 * @property {function(): void} announceLoadingFetchConfig
 * @property {function(): void} announceFetchConfigLoaded
 * @property {function(): void} announceFetchStarted
 * @property {function(): void} announceRequestSent
 * @property {function(): void} announceResponseReceived
 * @property {function(): void} announceFetchComplete
 * @property {function(): void} announceResponseProcessing
 * @property {function(): void} announceResponseProcessed
 * @property {function(): void} announceProcessingComplete
 * @property {function(Error): void} setAbortError
 * @property {function(Error): void} setClientError
 * @property {function(Error): void} setFetchError
 * @property {function(Error): void} setProcessingError
 * @property {function(object): void} setDocument
 * @property {function(object): void} setDownloadProgress
 */

/**
 * @typedef {object} FetcherExternalActions
 * @property {function(object): object} setDocument
 * @property {function(number): object} setFetchStatus
 * @property {function(string): object} setReportUID
 * @property {function(object): object} setDownloadProgress
 * @property {function(number): object} updateFetchStatus
 */

/**
 * @typedef {object} FetcherExternalSelectors
 * @property {function(object): number} getReportFetchTimeout
 * @property {function(object): string} getReportUid
 * @property {function(object): object} getReportAuthCredentials
 * @property {function(object): object} getReportProxyConfiguration
 * @property {function(object): string} getReportApiBaseURL
 * @property {function(object): object} getApiHeaders
 * @property {function(object): boolean} getIsTesting
 * @property {function(object): boolean} getIsDevel
 */

/**
 * @typedef {object} FetcherSignals
 * @property {number} ABORT_COMPLETE
 * @property {number} UNKNOWN_ERROR
 * @property {number} RESPONSE_RECEIVED
 * @property {number} RESPONSE_PROCESSING
 * @property {number} RESPONSE_PROCESSED
 * @property {number} REQUEST_SENT
 * @property {number} ABORT_STARTED
 * @property {number} PROCESSING_ERROR
 * @property {number} PROCESSING_COMPLETE
 * @property {number} LOADING_FETCH_CONFIG
 * @property {number} FETCH_STARTED
 * @property {number} FETCH_ERROR
 * @property {number} FETCH_CONFIG_LOADED
 * @property {number} FETCH_COMPLETE
 * @property {number} CLIENT_ERROR
 * @property {number} THREAD_FETCH
 * @property {number} SYNC_FETCH
 * @property {number} STARTING
 * @property {number} INIT
 * @property {number} PROCESS_STAGE_MASK
 * @property {number} ERROR_MASK
 * @property {number} FETCH_STAGE_MASK
 * @property {number} SETTINGS_MASK
 * @property {number} ALL
 * @property {number} NONE
 */

/**
 * @template S
 * @typedef {import("@reduxjs/toolkit").GetThunkAPI<S>} GetThunkAPI<S>
 */

// // eslint-disable-next-line no-unused-vars
// let errorIfUndefined = (value, objName, propName) => value;
// let validateConstructorObjects = ({ actions, selectors }) => {};
// if(__DEV__) {
//   class UndefinedPropertyError extends Error { }
//   errorIfUndefined = (value, objName, propName) => {
//     if(typeof value === 'undefined') throw new UndefinedPropertyError(
//       `\`${objName}.${propName}\` cannot be undefined.`
//     );
//     return value;
//   };
//   validateConstructorObjects = ({ actions, selectors }) => {
//     const reqdActions = [
//       'setDocument',
//       'setFetchStatus',
//       'setReportUID',
//       'setDownloadProgress',
//       'updateFetchStatus',
//     ];
//     for(const action of reqdActions) {
//       errorIfUndefined(actions[action], 'actions', action);
//     }
//     const reqdSelectors = [
//       'getReportFetchTimeout',
//       'getReportUid',
//       'getReportAuthCredentials',
//       'getReportProxyConfiguration',
//       'getReportApiBaseURL',
//       'getApiHeaders',
//       'getIsTesting',
//       'getIsDevel',
//     ];
//     for(const selector of reqdSelectors) {
//       errorIfUndefined(selectors[selector], 'selectors', selector);
//     }
//   }
// }

let ensureDefined = (arg, name = '') => arg;
if(__DEV__) {
  ensureDefined = (arg, name) => {
    if(typeof arg === 'undefined') {
      throw new Error(`${name} is undefined`);
    }
    return arg;
  };
}

class ReportFetchConfig {

  _getReportProxyConfiguration = undefined;
  get proxyConfiguration() {
    return this._getReportProxyConfiguration(this._getState());
  }
  _getReportAuthCredentials = undefined;
  get authCredentials() {
    return this._getReportAuthCredentials(this._getState());
  }
  _getReportUid = undefined;
  get reportUid() {
    return this._getReportUid(this._getState());
  }
  _getReportFetchTimeout = undefined;
  get fetchTimeout() {
    return this._getReportFetchTimeout(this._getState());
  }
  _getIsDevel = undefined;
  get isDevel() {
    return this._getIsDevel(this._getState());
  }
  _getIsTesting = undefined;
  get isTesting() {
    return this._getIsTesting(this._getState());
  }
  _getReportApiBaseURL = undefined;
  get apiBaseURL() {
    return this._getReportApiBaseURL(this._getState());
  }
  _getApiHeaders = undefined;
  get apiHeaders() {
    return this._getApiHeaders(this._getState());
  }

  _dispatch = undefined;
  _updateFetchStatus = undefined;
  _LOADING_FETCH_CONFIG = undefined;
  announceLoadingFetchConfig(err = null) {
    const actionObj = this._updateFetchStatus(this._LOADING_FETCH_CONFIG, err);
    return this._dispatch(actionObj);
  }
  _FETCH_CONFIG_LOADED = undefined;
  announceFetchConfigLoaded(err = null) {
    const actionObj = this._updateFetchStatus(this._FETCH_CONFIG_LOADED, err);
    return this._dispatch(actionObj);
  }
  _FETCH_STARTED = undefined;
  announceFetchStarted(err = null) {
    const actionObj = this._updateFetchStatus(this._FETCH_STARTED, err);
    return this._dispatch(actionObj);
  }
  _REQUEST_SENT = undefined;
  announceRequestSent(err = null) {
    const actionObj = this._updateFetchStatus(this._REQUEST_SENT, err);
    return this._dispatch(actionObj);
  }
  _RESPONSE_RECEIVED = undefined;
  announceResponseReceived(err = null) {
    const actionObj = this._updateFetchStatus(this._RESPONSE_RECEIVED, err);
    return this._dispatch(actionObj);
  }
  _FETCH_COMPLETE = undefined;
  announceFetchComplete(err = null) {
    const actionObj = this._updateFetchStatus(this._FETCH_COMPLETE, err);
    return this._dispatch(actionObj);
  }
  _RESPONSE_PROCESSING = undefined;
  announceResponseProcessing(err = null) {
    const actionObj = this._updateFetchStatus(this._RESPONSE_PROCESSING, err);
    return this._dispatch(actionObj);
  }
  _RESPONSE_PROCESSED = undefined;
  announceResponseProcessed(err = null) {
    const actionObj = this._updateFetchStatus(this._RESPONSE_PROCESSED, err);
    return this._dispatch(actionObj);
  }
  _PROCESSING_COMPLETE = undefined;
  announceProcessingComplete(err = null) {
    const actionObj = this._updateFetchStatus(this._PROCESSING_COMPLETE, err);
    return this._dispatch(actionObj);
  }
  _ABORT_COMPLETE = undefined;
  announceAbort(err = null) {
    const actionObj = this._updateFetchStatus(this._ABORT_COMPLETE, err);
    return this._dispatch(actionObj);
  }
  _CLIENT_ERROR = undefined;
  announceClientError(err = null) {
    const actionObj = this._updateFetchStatus(this._CLIENT_ERROR, err);
    return this._dispatch(actionObj);
  }
  _FETCH_ERROR = undefined;
  announceFetchError(err = null) {
    const actionObj = this._updateFetchStatus(this._FETCH_ERROR, err);
    return this._dispatch(actionObj);
  }
  _PROCESSING_ERROR = undefined;
  announceProcessingError(err = null) {
    const actionObj = this._updateFetchStatus(this._PROCESSING_ERROR, err);
    return this._dispatch(actionObj);
  }

  _setDocument = undefined;
  setDocument(document, err = null) {
    const actionObj = this._setDocument(document, err);
    return this._dispatch(actionObj);
  }

  _setDownloadProgress = undefined;
  setDownloadProgress(progressEvt, err = null) {
    const { lengthComputable, loaded, total } = progressEvt;
    const actionObj = this._setDownloadProgress(
      { lengthComputable, loaded, total },
      err,
    );
    return this._dispatch(actionObj);
  }

  cancelToken = undefined;

  /**
   * @param {object} props
   * @param {FetcherExternalActions} props.actions
   * @param {FetcherExternalSelectors} props.selectors
   * @param {function(object): void} props.dispatch
   * @param {function(): object} props.getState
   * @param {Object.<string, number>} props.signals
   */
  constructor({ actions, selectors, signals, dispatch, getState }) {
    this._getState = getState;
    this._dispatch = dispatch;

    this._getReportProxyConfiguration = selectors.getReportProxyConfiguration;
    this._getReportAuthCredentials = selectors.getReportAuthCredentials;
    this._getReportUid = selectors.getReportUid;
    this._getReportFetchTimeout = selectors.getReportFetchTimeout;
    this._getIsDevel = selectors.getIsDevel;
    this._getIsTesting = selectors.getIsTesting;
    this._getReportApiBaseURL = selectors.getReportApiBaseURL;
    this._getApiHeaders = selectors.getApiHeaders;

    this._updateFetchStatus = actions.updateFetchStatus;
    this._setDocument = actions.setDocument;
    this._setDownloadProgress = actions.setDownloadProgress;

    this._LOADING_FETCH_CONFIG = signals.LOADING_FETCH_CONFIG;
    this._FETCH_CONFIG_LOADED = signals.FETCH_CONFIG_LOADED;
    this._FETCH_STARTED = signals.FETCH_STARTED;
    this._REQUEST_SENT = signals.REQUEST_SENT;
    this._RESPONSE_RECEIVED = signals.RESPONSE_RECEIVED;
    this._FETCH_COMPLETE = signals.FETCH_COMPLETE;
    this._RESPONSE_PROCESSING = signals.RESPONSE_PROCESSING;
    this._RESPONSE_PROCESSED = signals.RESPONSE_PROCESSED;
    this._PROCESSING_COMPLETE = signals.PROCESSING_COMPLETE;
    this._ABORT_COMPLETE = signals.ABORT_COMPLETE;
    this._CLIENT_ERROR = signals.CLIENT_ERROR;
    this._FETCH_ERROR = signals.FETCH_ERROR;
    this._PROCESSING_ERROR = signals.PROCESSING_ERROR;

    this.cancelToken = Axios.CancelToken.source();
  }
}

export class ReportFetch {

  constructor({ actions, selectors, signals, thunkAPI }) {
    this.config = new ReportFetchConfig({
      actions, selectors, signals,
      dispatch: thunkAPI.dispatch,
      getState: thunkAPI.getState,
    });
    this._abortSignal = thunkAPI.signal;
    this._abortSignal.addEventListener('abort', this.cleanup.bind(this));
  }

  async _loadFetchConfig() {
    try {
      this.config.announceLoadingFetchConfig();
      const axiosInstance = Axios.create({
        // https://github.com/axios/axios#request-config
        baseURL: this.config.apiBaseURL,
        timeout: this.config.fetchTimeout,
        headers: this.config.apiHeaders,
        cancelToken: this.config.cancelToken.token,
        maxContentLength: Infinity,
        auth: this.config.authCredentials,
        proxy: this.config.proxyConfiguration,
      });
      this.config.announceFetchConfigLoaded();
      return axiosInstance;
    } catch(err) {
      if(!Axios.isCancel(err)) {
        this.config.announceClientError(err);
      }
      throw err;
    }
  }

  async _fetchDocument(axiosInstance) {
    try {
      this.config.announceFetchStarted();
      const response = await axiosInstance.request({
        url: `/${this.config.reportUid}`,
        method: 'GET',
        params: {},
        transformRequest: [
          data => {
            this.config.announceRequestSent();
            return data;
          },
        ],
        transformResponse: [
          data => {
            this.config.announceResponseReceived();
            return data;
          },
        ],
        onDownloadProgress: this.config.setDownloadProgress.bind(this.config),
      });
      this.config.announceFetchComplete();
      return response;
    } catch(err) {
      if(!Axios.isCancel(err)) {
        this.config.announceFetchError(err);
      }
      throw err;
    }
  }

  async _processResponse(response) {
    try {
      this.config.announceResponseProcessing();
      const report = response.data;
      this.config.announceResponseProcessed();
      this.config.setDocument(report);
      this.config.announceProcessingComplete();
    } catch(err) {
      if(!Axios.isCancel(err)) {
        this.config.announceProcessingError(err);
      }
      throw err;
    }
  }

  async run() {
    try {
      const axiosInstance = await this._loadFetchConfig();
      const response = await this._fetchDocument(axiosInstance);
      await this._processResponse(response);
    } catch(err) {
      if(Axios.isCancel(err)) {
        this.config.announceAbort(err);
        await this.cleanup();
      } else {
        throw err;
      }
    }
  }

  async cleanup() {
    try {
      this.config.cancelToken.cancel();
      this.config = null;
    } catch(err) {

    }
  }

  abort() {
    if(!this._abortSignal.aborted) {
      this._abortSignal.dispatchEvent(new Event('abort'));
    }
  }

}

/**
 * @param {FetchReportConfig} props
 * @returns {Promise<void>}
 */
export async function fetchReport({
  Axios,
  basicAuthCredentials,
  proxyConfiguration,
  reportUid,
  fetchTimeout,
  cancelToken,
  isDevel,
  isTesting,
  apiHeaders,
  apiReportsBaseUrl,
  announceLoadingFetchConfig,
  announceFetchConfigLoaded,
  announceFetchStarted,
  announceRequestSent,
  announceResponseReceived,
  announceFetchComplete,
  announceResponseProcessing,
  announceResponseProcessed,
  announceProcessingComplete,
  setAbortError,
  setClientError,
  setFetchError,
  setProcessingError,
  setDocument,
  setDownloadProgress,
}) {
  try {
    announceLoadingFetchConfig();
    let axiosInstance;
    try {
      axiosInstance = Axios.create({
        // https://github.com/axios/axios#request-config
        baseURL: apiReportsBaseUrl,
        timeout: fetchTimeout,
        headers: apiHeaders,
        cancelToken: cancelToken,
        maxContentLength: Infinity,
        auth: basicAuthCredentials,
        proxy: proxyConfiguration,
      });
      announceFetchConfigLoaded();
    } catch(err1) {
      setClientError(err1);
    }
    announceFetchStarted();
    let response;
    try {
      response = await axiosInstance.request({
        url: `/${reportUid}`,
        method: 'GET',
        params: {},
        transformRequest: [
          data => {
            announceRequestSent();
            return data;
          },
        ],
        transformResponse: [
          data => {
            announceResponseReceived();
            return data;
          },
        ],
        onDownloadProgress: setDownloadProgress,
      });
      announceFetchComplete();
    } catch(err2) {
      setFetchError(err2);
    }
    announceResponseProcessing();
    let report;
    try {
      report = response.data;
      announceResponseProcessed();
      setDocument(report);
      announceProcessingComplete();
    } catch(err3) {
      setProcessingError(err3);
    }
  } catch(errAll) {
    if(Axios.isCancel(errAll)) {
      setAbortError(errAll);
    } else {
      throw errAll;
    }
  }
}

export async function threadFetch() {
  let updateFetchStatus_maybe, UNKNOWN_ERROR_maybe, cancelSource_maybe;
  try {
    const {
      ABORT_COMPLETE, UNKNOWN_ERROR, RESPONSE_RECEIVED, RESPONSE_PROCESSING,
      RESPONSE_PROCESSED, REQUEST_SENT, ABORT_STARTED, PROCESSING_ERROR,
      PROCESSING_COMPLETE, LOADING_FETCH_CONFIG, FETCH_STARTED, FETCH_ERROR,
      FETCH_CONFIG_LOADED, FETCH_COMPLETE, CLIENT_ERROR,
      // THREAD_FETCH, SYNC_FETCH, STARTING, INIT, PROCESS_STAGE_MASK,
      // ERROR_MASK, FETCH_STAGE_MASK, SETTINGS_MASK, ALL, NONE,
    } = await import('./signals');
    UNKNOWN_ERROR_maybe = UNKNOWN_ERROR;
    let messageId = 0;
    const { default: Axios } = await import('axios/lib/core/Axios');
    const controller = new AbortController();
    const signal = controller.signal;
    const cancelSource = cancelSource_maybe = Axios.CancelToken.source();
    /** @callback {Func2<ActuallyAny, ActuallyAny>} */
    const FFIwrap = (method, to1 = 1_000) => (...args) => {
      return new Promise((resolve, reject) => {
        let _aListen = null, _rListen = null, toId = -1;
        const thisMessageId = messageId++;
        function cleanup(_) {
          if(toId > 0) clearTimeout(toId);
          if(_aListen) signal.removeEventListener('abort', _aListen);
          if(_rListen) globalThis.removeEventListener('message', _rListen);
        }
        try {
          // @ts-ignore
          toId = setTimeout(() => { throw new TimeoutError(method); }, to1);
          signal.addEventListener('abort', _aListen = () => {
            throw new AbortError(method);
          });
          globalThis.addEventListener('message', _rListen = ({ data }) => {
            if(data.id === thisMessageId) cleanup(resolve(data.response));
          });
          globalThis.postMessage({ method, args, id: thisMessageId });
        } catch(err) { cleanup(reject(err)); }
      });
    };
    const {
      getReportFetchTimeout,
      getReportUid,
      getReportAuthCredentials,
      getReportProxyConfiguration,
      getReportApiBaseURL,
      getApiHeaders,
      getIsTesting,
      getIsDevel,
      setDocument,
      updateFetchStatus,
      // setFetchStatus,
      // setReportUID,
      setDownloadProgress,
    } = Object.fromEntries([
      'getReportFetchTimeout',
      'getReportUid',
      'getReportAuthCredentials',
      'getReportProxyConfiguration',
      'getReportApiBaseURL',
      'getApiHeaders',
      'getIsTesting',
      'getIsDevel',
      'setDocument',
      'updateFetchStatus',
      // 'setFetchStatus',
      // 'setReportUID',
      'setDownloadProgress',
    ].map(method => [ method, FFIwrap(method) ]));
    updateFetchStatus_maybe = updateFetchStatus;
    globalThis.addEventListener('message', ({ data: { directive } }) => {
      if(directive === ABORT_STARTED) controller.abort();
    });
    signal.addEventListener('abort', () => {
      cancelSource.cancel();
      updateFetchStatus(ABORT_COMPLETE);
      throw BENIGN_JUMP;
    });
    await fetchReport({
      Axios,
      proxyConfiguration: await getReportProxyConfiguration(),
      basicAuthCredentials: await getReportAuthCredentials(),
      reportUid: await getReportUid(),
      fetchTimeout: await getReportFetchTimeout(),
      isDevel: await getIsDevel(),
      isTesting: await getIsTesting(),
      apiReportsBaseUrl: await getReportApiBaseURL(),
      apiHeaders: await getApiHeaders(),
      cancelToken: cancelSource.token,
      announceLoadingFetchConfig: () => updateFetchStatus(LOADING_FETCH_CONFIG),
      announceFetchConfigLoaded: () => updateFetchStatus(FETCH_CONFIG_LOADED),
      announceFetchStarted: () => updateFetchStatus(FETCH_STARTED),
      announceRequestSent: () => updateFetchStatus(REQUEST_SENT),
      announceResponseReceived: () => updateFetchStatus(RESPONSE_RECEIVED),
      announceFetchComplete: () => updateFetchStatus(FETCH_COMPLETE),
      announceResponseProcessing: () => updateFetchStatus(RESPONSE_PROCESSING),
      announceResponseProcessed: () => updateFetchStatus(RESPONSE_PROCESSED),
      announceProcessingComplete: () => updateFetchStatus(PROCESSING_COMPLETE),
      setAbortError: err => updateFetchStatus(ABORT_COMPLETE, err),
      setClientError: err => updateFetchStatus(CLIENT_ERROR, err),
      setFetchError: err => updateFetchStatus(FETCH_ERROR, err),
      setProcessingError: err => updateFetchStatus(PROCESSING_ERROR, err),
      setDocument: document => setDocument(document),
      setDownloadProgress: evt => setDownloadProgress(evt),
    });
    globalThis.postMessage({ status: END });
  } catch(outerError) {
    if(outerError !== BENIGN_JUMP) {
      if(cancelSource_maybe) {
        cancelSource_maybe.cancel();
        await cancelSource_maybe.token.promise;
      }
      if(outerError.name !== AbortError.name) {
        if(isFunc(updateFetchStatus_maybe) && UNKNOWN_ERROR_maybe) {
          // noinspection JSObjectNullOrUndefined,JSValidateTypes
          updateFetchStatus_maybe(UNKNOWN_ERROR_maybe, outerError);
        }
      }
    }
  }
}

(async () => {
  if(IS_THREAD) {
    await threadFetch();
  }
})();
