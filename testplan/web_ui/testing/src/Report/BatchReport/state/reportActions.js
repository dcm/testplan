import reportSlice from './reportSlice';

export { default as runFetch } from './reportWorker/runFetch';
export const {
  updateFetchStatus,
  setFetchStatus,
  setDocument,
  setBasicAuthCredentials,
  setProxyConfiguration,
  setReportUID,
  setDownloadProgress,
} = reportSlice.actions;
