import { createAsyncThunk } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import * as reportSelectors from '../reportSelectors';
import * as appSelectors from '../../../../state/appSelectors';
import { PropagateIndices } from '../../../reportUtils';

export const REPORT_FETCH_CANCEL = 'REPORT_FETCH_CANCEL';

export default createAsyncThunk(
  'FETCH_REPORT',
  async (reportUid, { dispatch, getState, signal, rejectWithValue }) => {
    const { setDownloadProgress, setReportUID } = await import('./');
    const { default: Axios } = await import('axios/lib/core/Axios');
    try {
      // setup fetch
      dispatch(setReportUID(reportUid));
      const cancelSource = Axios.CancelToken.source();
      const axiosInstance = Axios.create({
        ...reportSelectors.getReportAxiosPartialConfig(getState()),
        cancelToken: cancelSource.token,
      });
      signal.addEventListener('abort', () => {
        cancelSource.cancel('The fetch was cancelled.');
      });
      // execute fetch
      const response = await axiosInstance.request({
        url: `/${reportUid}`,
        method: 'GET',
        onDownloadProgress: progress => dispatch(setDownloadProgress(progress)),
      });
      // process response
      return PropagateIndices(response.data);
    } catch(err) {
      if(Axios.isCancel(err)) {
        return rejectWithValue(REPORT_FETCH_CANCEL);
      } else {
        return rejectWithValue({
          name: err.name,
          message: err.message,
          stack: err.stack,
        });
      }
    }
  },
  // @ts-ignore
  {
    condition(reportUid, { getState }) {
      const currReportUid = reportSelectors.getReportUid(getState());
      const isFetching = reportSelectors.getReportIsFetching(getState());
      if(isFetching && reportUid === currReportUid) {
        return false;
      }
    },
    dispatchConditionRejection: false,
  }
);
