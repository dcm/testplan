import { createSelector } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import * as appSelectors from '../../../state/appSelectors';

export const mkGetReportUid = () => st => st.uid;
export const getReportUid = mkGetReportUid();

export const mkGetReportDocument = () => st => st.document;
export const getReportDocument = mkGetReportDocument();

export const mkGetReportIsFetching = () => st => st.report.isFetching;
export const getReportIsFetching = mkGetReportIsFetching();

export const mkGetReportIsFetchCancelled = () => st => {
  return st.report.isFetchCancelled;
};
export const getReportIsFetchCancelled = mkGetReportIsFetchCancelled();

export const mkGetReportLastFetchError = () => st => st.report.fetchError;
export const getReportLastFetchError = mkGetReportLastFetchError();

export const mkGetReportMaxContentLength = () => st => {
  return st.report.maxContentLength;
};
export const getReportMaxContentLength = mkGetReportMaxContentLength();

export const mkGetReportFetchTimeout = () => st => st.report.fetchTimeout;
export const getReportFetchTimeout = mkGetReportFetchTimeout();

export const mkGetReportDownloadProgress = () => st => {
  return st.report.downloadProgress;
};
export const getReportDownloadProgress = mkGetReportDownloadProgress();

export const mkGetReportApiBaseURL = () => createSelector(
  appSelectors.mkGetApiBaseURL(),
  baseURL => {
    const baseURLShaven = (baseURL || '').replace(/\/$/, '');
    return new URL(`${baseURLShaven}/reports`).href;
  }
);
export const getReportApiBaseURL = mkGetReportApiBaseURL();

export const mkGetMaxContentLength = () => st => st.report.maxContentLength;
export const getMaxContentLength = mkGetMaxContentLength();

export const mkGetReportAxiosPartialConfig = () => createSelector(
  appSelectors.getApiBaseURL,
  getReportFetchTimeout,
  appSelectors.getApiHeaders,
  getMaxContentLength,
  (baseURL, timeout, headers, maxContentLength) => ({
    baseURL, timeout, headers, maxContentLength,
  })
);
export const getReportAxiosPartialConfig = mkGetReportAxiosPartialConfig();
