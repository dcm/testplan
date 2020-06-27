import { createAsyncThunk } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
// import { syncBroker, threadBroker } from './brokers';

const runFetch = createAsyncThunk(
  'RUN_FETCH',
  async (reportUid, { dispatch, getState, signal, rejectWithValue }) => {
    const { setReportUID } = await import('../reportActions');
    dispatch(setReportUID(reportUid));
    try {
      const { updateFetchStatus } = await import('../reportActions');
      const { threadBroker } = await import('./brokers');
      const { INIT } = await import('./signals');
      dispatch(updateFetchStatus(INIT));
      return await threadBroker({ dispatch, getState, signal });
    } catch(error1) {
      try {
        const { updateFetchStatus } = await import('../reportActions');
        const { syncBroker } = await import('./brokers');
        const { INIT } = await import('./signals');
        dispatch(updateFetchStatus(INIT));
        return await syncBroker({ dispatch, getState, signal });
      } catch(error2) {
        return rejectWithValue([ error1, error2 ]);
      }
    }
  },
);

export const RUN_FETCH_PENDING_ACTION_TYPE = runFetch.pending.type;
export const RUN_FETCH_FULFILLED_ACTION_TYPE = runFetch.fulfilled.type;
export const RUN_FETCH_REJECTED_ACTION_TYPE = runFetch.rejected.type;
export default runFetch;
