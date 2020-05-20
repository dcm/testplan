import { queryStringToMap } from '../../../Common/utils';
import createNewSearchString from './createNewSearchString';

/* eslint-disable max-len */
/**
 * @async
 * Adds 'param=val' in the URL, returning a promise that resolves when the URL
 * is set or rejects if something goes wrong.
 * @param {string} param
 * @param {any} val
 * @param {import('history').History} history
 * @param {null | AbortSignal} [signal=null]
 * @param {number} [timeout=1000] - How many milliseconds to wait before rejecting
 * @returns {Promise<void>}
 */
export default async function setURLSearchParam(param, val, history, signal = null, timeout = 1000) {
/* eslint-enable max-len */
  const locationChangePromise = new Promise((resolve, reject) => {
    let unlisten;
    try {
      // this resolves once the URL contains '?param=val'
      let timeoutId = 0;
      unlisten = history.listen(({ search }) => {
        if(queryStringToMap(search).get(param) === val) {
          clearTimeout(timeoutId);
          resolve({ unlisten, error: null });
        } else if(signal && signal.aborted) {
          clearTimeout(timeoutId);
          reject({ unlisten, error: signal });
        }
      });
      // @ts-ignore
      timeoutId = setTimeout(() => {
        reject({ unlisten, error: new Error(`Timeout after ${timeout}ms`) });
      }, timeout);
    } catch(error) { reject({ unlisten, error }); }
  }).then(({ unlisten }) => {
    unlisten();
  }).catch(({ unlisten, error }) => {
    if(typeof unlisten === 'function') unlisten();
    throw error;
  });
  history.push({
    ...history.location,
    search: createNewSearchString(param, val, history.location.search),
  });
  return await locationChangePromise;
};
