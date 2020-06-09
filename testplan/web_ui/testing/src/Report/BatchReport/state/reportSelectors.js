import { createSelector } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { mkGetApiBaseURL } from '../../../state/appSelectors';

export const mkGetReportFetchStage = () => st => st.stage;

export const mkGetReportFetchTimeout = () => st => st.fetchTimeout;
export const getReportFetchTimeout = mkGetReportFetchTimeout();

export const mkGetReportAuthCredentials = () => st => st.basicAuthCredentials;
export const getReportAuthCredentials = mkGetReportAuthCredentials();

export const mkGetReportProxyConfiguration = () => st => st.proxyConfiguration;
export const getReportProxyConfiguration = mkGetReportProxyConfiguration();

export const mkGetReportApiSubpath = () => st => st.apiReportsSubpath;

export const mkGetReportUid = () => st => st.uid;
export const getReportUid = mkGetReportUid();

export const mkGetReportDocument = () => st => st.document;

export const mkGetReportDocumentStatus = () => createSelector(
  mkGetReportDocument(),
  document => typeof document === 'object' ? document.status : null
);

export const mkGetReportFetchAttempts = () => st => st.fetchAttempts;

export const mkGetReportIsFetching = () => st => st.isFetching;

export const mkGetReportLastFetchError = () => st => st.lastFetchError;

export const mkGetReportReducerErrors = () => st => st._errors;

export const mkGetReportDownloadProgress = () => st => st.downloadProgress;

export const mkGetReportApiBaseURL = () => createSelector(
  mkGetApiBaseURL(),
  mkGetReportApiSubpath(),
  (baseURL, subpath) => {
    const baseURLShaven = (baseURL || '').replace(/\/$/, '');
    const subpathShaven = (subpath || '').replace(/^\//, '');
    return new URL(`${baseURLShaven}/${subpathShaven}`).href;
  }
);
export const getReportApiBaseURL = mkGetReportApiBaseURL();
