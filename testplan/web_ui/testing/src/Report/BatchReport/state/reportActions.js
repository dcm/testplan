import reportSlice from './reportSlice';

export { default as runFetch } from './reportWorker/runFetch';

export const {
  setDownloadProgress,
  setReportUID,
  setProxyConfiguration,
  setBasicAuthCredentials,
  updateFetchStatus,
  setFetchStatus,
  setDocument,
} = reportSlice.actions;
