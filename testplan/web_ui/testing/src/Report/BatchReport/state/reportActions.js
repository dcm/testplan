import reportSlice from './reportSlice';

export const {
  setDownloadProgress,
  setReportUID,
  setProxyConfiguration,
  setBasicAuthCredentials,
  updateFetchStatus,
  setFetchStatus,
  setDocument,
} = reportSlice.actions;
