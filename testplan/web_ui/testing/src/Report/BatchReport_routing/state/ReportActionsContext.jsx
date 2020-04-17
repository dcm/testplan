import { createContext, useContext } from 'react';
import reducer from './reducer';
import actionCreators from './actionCreators';
import { getChangedBitsCalculator, makeMaskMap } from '../utils';
// import calmLogger from '../utils/calmLogger';

export const actionsMaskMap = Object.freeze(makeMaskMap(actionCreators));
export const calculateChangedBits =
  Object.freeze(getChangedBitsCalculator(actionsMaskMap));

const ReportActionsContext = Object.defineProperty(
  createContext(reducer, calculateChangedBits),
  'displayName',
  {
    value: 'ReportActionsContext',
    writable: false,
  }
);

// const asyncCb = async cb => await cb();

export function useReportActionsContext(observedBits) {
  // const cl = calmLogger();
  const context = useContext(ReportActionsContext, observedBits);
  // asyncCb(() => cl.undo()).catch(console.warn);
  return context;
}

export default ReportActionsContext;
