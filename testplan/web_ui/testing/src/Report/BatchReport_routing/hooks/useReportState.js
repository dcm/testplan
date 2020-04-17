// @ts-nocheck
import { useMemo } from 'react';
import _at from 'lodash/at';
import {
  stateMaskMap, useReportStateContext
} from '../state/ReportStateContext';
import {
  actionsMaskMap, useReportActionsContext
} from '../state/ReportActionsContext';
import { singletonToValue } from '../../../Common/utils';
import { getObservedBitsGetter } from '../utils';

/** @typedef {(any|string|number|boolean|null|symbol|BigInt)} ActuallyAny */

const getObservedStateBits = getObservedBitsGetter(stateMaskMap);
const getObservedActionsBits = getObservedBitsGetter(actionsMaskMap);
export const resolveSlicer = ({ slicer, ifFalse, ifUndef, elseFunc }) => (
  slicer === false ? ifFalse : slicer === undefined ? ifUndef : elseFunc()
);

/**
 * @desc
 * <p>
 * React hook for the global app state.
 * </p>
 * <p>
 * The arguments here follow the rules of
 * {@linkcode https://lodash.com/docs/#at|lodash.at}, except that object paths
 * which yield a singleton array will be reduced to a single value.
 * </p>
 * <p>
 * The returned state & bound action creator slices will be memoized against
 * the rest of the state, so state changes in an unrelated part of the state
 * will not cause unnecessary rerenders.
 * </p>
 *
 * @example
 > [ state['uri']['hash']['query'] ] === useReportState('uri.hash.query')
 > [ state['uri']['hash']['query'] ] === useReportState([ 'uri', 'hash', 'query' ])
 > [
 ...   [
 ...     state['uri']['hash']['query'],
 ...     state['uri']['hash']['aliases']
 ...   ]
 ... ] === useReportState(
 ...   [ 'uri.hash.query', 'uri.hash.aliases' ]
 ... )
 > [
 ...   [
 ...     state['uri']['hash']['query'],
 ...     state['uri']['hash']['aliases']
 ...   ],
 ...   [
 ...     boundActionCreators['setAppBatchReportJsonReport'],
 ...     boundActionCreators['setAppBatchReportFetchError'],
 ...   ],
 ... ] === useReportState(
 ...   [ 'uri.hash.query', 'uri.hash.aliases' ],
 ...   [ 'setAppBatchReportJsonReport', 'setAppBatchReportFetchError' ]
 ... )
 > [ state, boundActionCreators ] === useReportState(undefined, undefined) === useReportState()
 > [ undefined, boundActionCreators ] === useReportState(false) === useReportState(null)
 > [ undefined, undefined ] === useReportState(false, false)
 > [ state, undefined ] === useReportState(undefined, false)

 * @param {string | string[] | Array<string[]> | boolean} [stateSlices]
 *   - One or more object paths denoting the substate slice(s) to return, or
 *     a 'falsey' value to skip returning state at all. Note that skipping this
 *     parameter, or passing `undefined` explicitly will return the whole state
 *     object.
 * @param {string | string[] | Array<string[]> | boolean} [actionsSlices]
 *   - One or more bound action creators to return, or a 'falsey' value to skip
 *     returning any bound action creators state at all. Note that skipping this
 *     parameter, or passing `undefined` explicitly, will return all bound
 *     action creators.
 * @returns {[ ActuallyAny | ActuallyAny[], ActuallyAny | ActuallyAny[] ]}
 *   - Array of [ sliceOfState, sliceOfActions ]. `sliceOfState` and
 *     `sliceOfActions` are arrays if `stateSlices` and `actionsSlices`
 *     are non-singleton arrays, respectively
 */
export default function useReportState(stateSlices, actionsSlices) {
  const observedStateBits = getObservedStateBits(stateSlices),
    state = useReportStateContext(observedStateBits),
    observedActionsBits = getObservedActionsBits(actionsSlices),
    actions = useReportActionsContext(observedActionsBits),
    subState = singletonToValue(
      resolveSlicer({
        slicer: stateSlices,
        ifFalse: null,
        ifUndef: [ state ],
        elseFunc: () => _at(state, stateSlices),
      })
    ),
    subActions = singletonToValue(
      resolveSlicer({
        slicer: actionsSlices,
        ifFalse: null,
        ifUndef: [ actions ],
        elseFunc: () => _at(actions, actionsSlices),
      })
    );
  return useMemo(
    () => [ subState, subActions ],
    [ subState, subActions ])
    ;
}
