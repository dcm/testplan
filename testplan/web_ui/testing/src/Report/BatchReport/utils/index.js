import * as filterStates from './filterStates';
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
