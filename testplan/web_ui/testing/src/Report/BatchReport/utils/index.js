import * as filterStates from './filterStates';
import { isPlain } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import equals from 'ramda/es/equals';
export { default as uriComponentCodec } from './uriComponentCodec';

export const safeGetNumPassedFailedErrored = (counter, coalesceVal = null) =>
  counter ? [
    counter.passed || coalesceVal,
    counter.failed || coalesceVal,
    counter.error || coalesceVal,
  ] : [ coalesceVal, coalesceVal, coalesceVal ];

export const isFilteredOut =
  (filter, [ numPassed = 0, numFailed = 0, numErrored = 0 ]) =>
    (filter === filterStates.PASSED && numPassed === 0) ||
    (filter === filterStates.FAILED && (numFailed + numErrored) === 0);

export function getChangedBitsCalculator(maskMap) {
  // build a mirror of mask map that holds functions to diff bits for
  //  a prop so successive diffs get faster (fewer if-thens + V8 JIT opps)
  const diffFuncTree = {};
  return function calculateChangedBits(prev, curr) {
    let matchedBits = 0;
    for(const [ prop, val ] of Object.entries(maskMap)) {
      if(typeof diffFuncTree[prop] !== 'function') {
        if(isPlain(val)) {
          diffFuncTree[prop] = getChangedBitsCalculator(val);
        } else {
          diffFuncTree[prop] = (_prev, _curr) => equals(_prev, _curr);
        }
      }
      matchedBits |= diffFuncTree[prop](prev[prop], curr[prop]) ? 0 : val;
      // right now it makes no difference if the result is 1 or 1073741823, the
      // component will rerender if the result is nonzero, so we bail out early
      if(matchedBits > 0) break;
    }
    return matchedBits;
  };
}
