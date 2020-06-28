import reportSlice from '../reportSlice';

export const {
  setMaxContentLength,
  setDownloadProgress,
  setReportUID,
  setFetchTimeout,
} = reportSlice.actions;

export { default as fetchReport } from './fetchReport';
