import { createAsyncThunk } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { batch } from 'react-redux/es';
import setURLSearchParam from './setURLSearchParam';

const __DEV__ = 'production' !== process.env.NODE_ENV;
export const noopTransformer = x => x;

/**
 * @template T, U
 * @typedef {object} CreateSearchParamSetterThunkOptions
 * @property {string} actionType
 * @property {string} param
 * @property {import("history").History} history
 * @property {function(T): U} [transformer=noopTransformer]
 */
/**
 * @typedef {object} ErrorData
 * @property {string} name
 * @property {string} message
 * @property {string} [stack=undefined]
 */
/**
 * @typedef {object} MetaObj
 * @property {number} time
 * @property {string} requestId
 */
/**
 * Creates an async thunk that conditionally* sets a search param and dispatches
 * an action, depending upon the search param.
 * *If the second argument to the returned thunk is `true` then the URL won't be
 * set.
 *
 * @template T, U
 * @param {CreateSearchParamSetterThunkOptions<T, U>} props
 */
export default function createSearchParamSetterThunk(
  {
    actionType,
    param,
    transformer = noopTransformer,
    history,
  }
) {
  if(__DEV__) {
    // eslint-disable-next-line max-len
    for(const [varName, varVal] of Object.entries({ actionType, param, history })) {
      if(typeof varVal === 'undefined') {
        throw new Error(`"${varName}" is not defined`);
      }
    }
  }
  const isRunningRef = { current: false };
  return createAsyncThunk(
    actionType,
    // eslint-disable-next-line max-len
    async function payloadCreator(
        { value, fromURL = false },
        { requestId, signal, rejectWithValue }
    ) {
      isRunningRef.current = true;
      const payload = transformer(value);
      try {
        // dispatch + location update  will trigger two rerenders - this busy
        // wait in `batch` will ensure they're all run at once
        batch(() => { while(isRunningRef.current && !signal.aborted) { }});
        // check that user initiated this action - if so set URL
        if(!fromURL) await setURLSearchParam(param, value, history);
        return { payload };
      } catch(e) {
        return rejectWithValue({
          payload,
          error: { name: e.name, message: e.message, stack: e.stack },
          meta: { time: Date.now(), requestId }
        });
      } finally { isRunningRef.current = false; }
    },
    { condition: () => !isRunningRef.current },
  );
};
