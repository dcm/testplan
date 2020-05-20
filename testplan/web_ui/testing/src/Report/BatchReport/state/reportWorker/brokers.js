/* eslint-disable no-restricted-globals */
import { setDocument } from '../reportActions';
import { setFetchStatus } from '../reportActions';
import { setReportUID } from '../reportActions';
import { setDownloadProgress } from '../reportActions';
import { updateFetchStatus } from '../reportActions';
import { getReportFetchTimeout } from '../reportSelectors';
import { getReportUid } from '../reportSelectors';
import { getReportAuthCredentials } from '../reportSelectors';
import { getReportProxyConfiguration } from '../reportSelectors';
import { getReportApiBaseURL } from '../reportSelectors';
import { getApiHeaders } from '../../../../state/appSelectors';
import { getIsTesting } from '../../../../state/appSelectors';
import { getIsDevel } from '../../../../state/appSelectors';
import * as Signals from './signals';

const isArr = v => Array.isArray(v);
const isNum = v => typeof v === 'number';
const isStr = v => typeof v === 'string';
// const isFunc = v => typeof v === 'function';
// const isObj = v => typeof v === 'object' && v !== null;

const JUMP = 'JUMP';
const END = 'END';
const ABORT = 'ABORT';

export async function threadBroker({ dispatch, getState, signal }) {
  try {
    const { default: Thread } = await import('worker-loader!./reportFetch');
    const thread = new Thread();
    dispatch(updateFetchStatus(Signals.THREAD_FETCH));
    let messageId = 0;
    signal.addEventListener('abort', () => {
      dispatch(updateFetchStatus(Signals.ABORT_STARTED));
      thread.postMessage({ id: messageId++, directive: Signals.ABORT_STARTED });
    });
    const FFI = {
      getFetchTimeout: () => getReportFetchTimeout(getState()),
      getReportUid: () => getReportUid(getState()),
      getBasicAuthCredentials: () => getReportAuthCredentials(getState()),
      getProxyConfiguration: () => getReportProxyConfiguration(getState()),
      getApiReportsBaseURL: () => getReportApiBaseURL(getState()),
      getApiHeaders: () => getApiHeaders(getState()),
      getIsTesting: () => getIsTesting(getState()),
      getIsDevel: () => getIsDevel(getState()),
      setDocument: (document, err) => dispatch(setDocument(document, err)),
      setFetchStatus: (mask, err) => dispatch(setFetchStatus(mask, err)),
      setReportUID: (uid) => dispatch(setReportUID(uid)),
      updateFetchStatus: (mask, err) => dispatch(updateFetchStatus(mask, err)),
      setDownloadProgress: evt => dispatch(setDownloadProgress(evt)),
    };
    thread.addEventListener('message', ({ data: { id } }) => {
      if(isNum(id)) messageId = Math.max(messageId, id);
    });
    thread.addEventListener('message', ({ data: { method, args, id } }) => {
      if(!isNum(id) || !isStr(method) || !isArr(args)) return;
      thread.postMessage({ response: FFI[method](...args), id });
    });
    thread.addEventListener('message', ({ data: { status } }) => {
      if(status === END) throw JUMP;
    });
  } catch(outerError) {
    if(outerError instanceof Error) throw outerError;
  }
}

export async function _syncBroker({ dispatch, getState, signal }) {
  let cancelSource_maybe;
  const boundUpdateFetchStatus = (signal, err) => {
    dispatch(updateFetchStatus(signal, err));
  };
  try {
    const { fetchReport } = await import('./reportFetch');
    const { default: Axios } = await import('axios/lib/core/Axios');
    boundUpdateFetchStatus(Signals.SYNC_FETCH);
    const cancelSource = cancelSource_maybe = Axios.CancelToken.source();
    signal.addEventListener('abort', async () => {
      boundUpdateFetchStatus(Signals.ABORT_STARTED);
      cancelSource.cancel();
      await cancelSource.token.promise;
      throw ABORT;
    });
    const bUFS = boundUpdateFetchStatus;
    await fetchReport({
      Axios,
      proxyConfiguration: getReportProxyConfiguration(getState()),
      basicAuthCredentials: getReportAuthCredentials(getState()),
      reportUid: getReportUid(getState()),
      fetchTimeout: getReportFetchTimeout(getState()),
      isDevel: getIsDevel(getState()),
      isTesting: getIsTesting(getState()),
      apiReportsBaseUrl: getReportApiBaseURL(getState()),
      apiHeaders: getApiHeaders(getState()),
      cancelToken: cancelSource.token,
      announceLoadingFetchConfig: () => bUFS(Signals.LOADING_FETCH_CONFIG),
      announceFetchConfigLoaded: () => bUFS(Signals.FETCH_CONFIG_LOADED),
      announceFetchStarted: () => bUFS(Signals.FETCH_STARTED),
      announceRequestSent: () => bUFS(Signals.REQUEST_SENT),
      announceResponseReceived: () => bUFS(Signals.RESPONSE_RECEIVED),
      announceFetchComplete: () => bUFS(Signals.FETCH_COMPLETE),
      announceResponseProcessing: () => bUFS(Signals.RESPONSE_PROCESSING),
      announceResponseProcessed: () => bUFS(Signals.RESPONSE_PROCESSED),
      announceProcessingComplete: () => bUFS(Signals.PROCESSING_COMPLETE),
      setAbortError: err => bUFS(Signals.ABORT_COMPLETE, err),
      setClientError: err => bUFS(Signals.CLIENT_ERROR, err),
      setFetchError: err => bUFS(Signals.FETCH_ERROR, err),
      setProcessingError: err => bUFS(Signals.PROCESSING_ERROR, err),
      setDocument: (document, err) => dispatch(setDocument(document, err)),
      setDownloadProgress: evt => dispatch(setDownloadProgress(evt)),
    });
  } catch(outerError) {
    if(cancelSource_maybe) {
      cancelSource_maybe.cancel();
      await cancelSource_maybe.token.promise;
    }
    if(outerError === ABORT) {
      dispatch(updateFetchStatus(Signals.ABORT_COMPLETE));
    } else if(outerError instanceof Error) {
      throw outerError;
    }
  }
}

export async function syncBroker({ dispatch, getState, signal }) {
  let cancelSource_maybe;
  const boundUpdateFetchStatus = (signal, err) => {
    dispatch(updateFetchStatus(signal, err));
  };
  try {
    // @ts-ignore
    // eslint-disable-next-line max-len
    const { FetchReportFactory } = await import('comlink-loader?singleton=false!./reportFetch');
    const { default: Axios } = await import('axios/lib/core/Axios');
    boundUpdateFetchStatus(Signals.SYNC_FETCH);
    const cancelSource = cancelSource_maybe = Axios.CancelToken.source();
    signal.addEventListener('abort', async () => {
      boundUpdateFetchStatus(Signals.ABORT_STARTED);
      cancelSource.cancel();
      await cancelSource.token.promise;
      throw ABORT;
    });
    const bUFS = boundUpdateFetchStatus;
    const fetchReport = new FetchReportFactory();
    const fetcher = await fetchReport({
      Axios,
      proxyConfiguration: getReportProxyConfiguration(getState()),
      basicAuthCredentials: getReportAuthCredentials(getState()),
      reportUid: getReportUid(getState()),
      fetchTimeout: getReportFetchTimeout(getState()),
      isDevel: getIsDevel(getState()),
      isTesting: getIsTesting(getState()),
      apiReportsBaseUrl: getReportApiBaseURL(getState()),
      apiHeaders: getApiHeaders(getState()),
      cancelToken: cancelSource.token,
      announceLoadingFetchConfig: () => bUFS(Signals.LOADING_FETCH_CONFIG),
      announceFetchConfigLoaded: () => bUFS(Signals.FETCH_CONFIG_LOADED),
      announceFetchStarted: () => bUFS(Signals.FETCH_STARTED),
      announceRequestSent: () => bUFS(Signals.REQUEST_SENT),
      announceResponseReceived: () => bUFS(Signals.RESPONSE_RECEIVED),
      announceFetchComplete: () => bUFS(Signals.FETCH_COMPLETE),
      announceResponseProcessing: () => bUFS(Signals.RESPONSE_PROCESSING),
      announceResponseProcessed: () => bUFS(Signals.RESPONSE_PROCESSED),
      announceProcessingComplete: () => bUFS(Signals.PROCESSING_COMPLETE),
      setAbortError: err => bUFS(Signals.ABORT_COMPLETE, err),
      setClientError: err => bUFS(Signals.CLIENT_ERROR, err),
      setFetchError: err => bUFS(Signals.FETCH_ERROR, err),
      setProcessingError: err => bUFS(Signals.PROCESSING_ERROR, err),
      setDocument: (document, err) => dispatch(setDocument(document, err)),
      setDownloadProgress: evt => dispatch(setDownloadProgress(evt)),
    });
    await fetcher;
  } catch(outerError) {
    if(cancelSource_maybe) {
      cancelSource_maybe.cancel();
      await cancelSource_maybe.token.promise;
    }
    if(outerError === ABORT) {
      dispatch(updateFetchStatus(Signals.ABORT_COMPLETE));
    } else if(outerError instanceof Error) {
      throw outerError;
    }
  }
}
