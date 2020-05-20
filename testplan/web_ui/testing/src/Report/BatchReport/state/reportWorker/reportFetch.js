/// <reference lib="webworker" />
/// <reference lib="dom" />
/* global globalThis */
/* eslint-disable no-restricted-globals */
/* eslint-env worker,browser */
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
