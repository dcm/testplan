import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import wrapActionCreators from 'react-redux/es/utils/wrapActionCreators';

/**
 * This should be used as a waystation of sorts for other parts of the app to store some
 * temporary state to coordinate activities, e.g. making sure an action does / does not
 * dispatch based the values held in `pendingActions`.
 */
const synchronizationSlice = createSlice({
  name: 'synchronization',
  initialState: {
    /** @type {Array<{ type: string, id: string, time: number, data?: any }>} */
    pendingActions: [],
  },
  reducers: {
    registerPendingAction: {
      reducer(state, { meta: { time }, payload: { type, id, data } }) {
        state.pendingActions.push({ type, id, time, data });
      },
      /**
       * @param {string} type
       * @param {string | number} id
       * @param {any} [data=undefined]
       */
      prepare: (type, id, data) => ({
        meta: { time: Date.now() }, payload: { type, id, data }
      }),
    },
    unregisterPendingAction: {
      reducer(state, { payload: { type, id } }) {
        if(!state.pendingActions.length) return;
        for(let i = 0; i < state.pendingActions.length; ++i) {
          const obj = state.pendingActions[i];
          if(obj.type === type && obj.id === id) {
            state.pendingActions.splice(i, 1);
          }
        }
      },
      /**
       * @param {string} type
       * @param {string | number} id
       */
      prepare: (type, id) => ({ payload: { type, id } }),
    },
  },
});

export const {
  registerPendingAction: bare_registerPendingAction,
  unregisterPendingAction: bare_unregisterPendingAction,
} = synchronizationSlice.actions;
export const {
  registerPendingAction,
  unregisterPendingAction,
} = wrapActionCreators(synchronizationSlice.actions);
export default synchronizationSlice;
