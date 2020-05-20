import { createSelector } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { mkGetApiBaseURL } from '../../../state/appSelectors';

export const mkGetReportFetchStage = () =>
    state => state.stage;
export const getReportFetchStage =
  mkGetReportFetchStage();

export const mkGetReportFetchTimeout = () =>
    state => state.fetchTimeout;
export const getReportFetchTimeout =
  mkGetReportFetchTimeout();

export const mkGetReportAuthCredentials = () =>
    state => state.basicAuthCredentials;
export const getReportAuthCredentials =
  mkGetReportAuthCredentials();

export const mkGetReportProxyConfiguration = () =>
    state => state.proxyConfiguration;
export const getReportProxyConfiguration =
  mkGetReportProxyConfiguration();

export const mkGetReportApiSubpath = () =>
    state => state.apiReportsSubpath;
export const getReportApiSubpath =
  mkGetReportApiSubpath();

export const mkGetReportUid = () =>
    state => state.uid;
export const getReportUid =
  mkGetReportUid();

export const mkGetReportDocument = () =>
    state => state.document;
export const getReportDocument =
  mkGetReportDocument();

export const mkGetReportFetchAttempts = () =>
    state => state.fetchAttempts;
export const getReportFetchAttempts =
  mkGetReportFetchAttempts();

export const mkGetReportIsFetching = () =>
    state => state.isFetching;
export const getReportIsFetching =
  mkGetReportIsFetching();

export const mkGetReportLastFetchError = () =>
    state => state.lastFetchError;
export const getReportLastFetchError =
  mkGetReportLastFetchError();

export const mkGetReportReducerErrors = () =>
    state => state._errors;
export const getReportReducerErrors =
  mkGetReportReducerErrors();

export const mkGetReportDownloadProgress = () =>
    state => state.downloadProgress;
export const getReportDownloadProgress =
  mkGetReportDownloadProgress();

export const mkGetReportApiBaseURL = () =>
  createSelector(
    mkGetApiBaseURL(),
    mkGetReportApiSubpath(),
    (baseURL, subpath) => {
      const baseURLShaven = (baseURL || '').replace(/\/$/, '');
      const subpathShaven = (subpath || '').replace(/^\//, '');
      return new URL(`${baseURLShaven}/${subpathShaven}`).href;
    }
  );
export const getReportApiBaseURL =
  mkGetReportApiBaseURL();
