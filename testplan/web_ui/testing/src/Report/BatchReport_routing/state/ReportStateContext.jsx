import { createContext, useContext } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import { getChangedBitsCalculator, makeMaskMap } from '../utils';
// import calmLogger from '../utils/calmLogger';
import defaultState from './defaultState';

const state = _cloneDeep(defaultState);
export const stateMaskMap = Object.freeze(makeMaskMap(state));
export const calculateChangedBits =
  Object.freeze(getChangedBitsCalculator(stateMaskMap));

const ReportStateContext = Object.defineProperty(
  createContext(state, calculateChangedBits),
  'displayName',
  {
    value: 'ReportStateContext',
    writable: false,
  }
);

// const asyncCb = async cb => await cb();

export function useReportStateContext(observedBits) {
  const //cl = calmLogger(),
    context = useContext(ReportStateContext, observedBits);
  // asyncCb(cl._.undo);
  // asyncCb(() => cl.undo()).catch(console.warn);
  return context;
}

export default ReportStateContext;
