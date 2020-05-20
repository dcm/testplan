import { queryStringToEntriesGenerator } from '../../../Common/utils';

/* eslint-disable max-len */
/**
 * This function creates a callback suitable for passing to
 * {@link https://github.com/ReactTraining/history/blob/v4.10.1/docs/GettingStarted.md#listening history.listen}.
 * It takes a {@link https://redux.js.org/api/store#dispatchaction dispatch}
 * function and an object mapping of `searchParam => actionCreator` and dispatches
 * the `actionCreator` whenever `searchParam` is set in the URL and passes
 * the JSON.parse'd value of `searchParam` as its first argument to `actionCreator`.
 *
 * The second argument it passes to `actionCreator` is always `true`. This can
 * be used as a signal to `actionCreator` that the action was dispatched from
 * a history listener rather than from the user.
 *
 * @example
 > const setDarkModeAction = isDarkMode => ({ type: 'SET_DARK_MODE', payload: !!isDarkMode });
 > const store = require('redux').createStore((state = { darkMode: false }, action) => {
 ...  switch(action.type) {
 ...    case 'SET_DARK_MODE':
 ...      return { ...state, darkMode: action.payload };
 ...    default:
 ...      return state;
 ...  }
 ... });
 > const paramsListener = createSearchParamsHandler(store.dispatch, { darkMode: setDarkModeAction });
 > store.getState()
 { darkMode: false }
 > const hist = require('history').createMemoryHistory();  // browser & hash history works the same but requires a DOM
 > const unlisten = hist.listen(paramsListener);
 > hist.push('http://www.web.site/');
 > store.getState()  // nothing changed, 'darkMode' not encountered
 { darkMode: false }
 > hist.push('http://www.web.site/?potato=tomato');
 > store.getState()  // same, no actions triggered
 { darkMode: false }
 > hist.push('http://www.web.site/?potato=tomato&darkMode=1');
 > store.getState()  // triggered
 { darkMode: true }
 *
 * @param {import('redux').Dispatch} dispatchFunc
 * @param {Object.<string, function(any, boolean?): import('redux').Action>} actionCreatorsMapping
 * @returns {import('history').LocationListener}
 */
export default function createSearchParamsListener(dispatchFunc, actionCreatorsMapping) {
/* eslint-enable max-len */
  let prevSearchStr = '';
  return function historyListener({ search: currSearchStr }, historyAction) {
    if(prevSearchStr !== currSearchStr) {
      for(const [param, val] of queryStringToEntriesGenerator(currSearchStr)) {
        const action = actionCreatorsMapping[param];
        if(action) dispatchFunc(action(val, true));
      }
      prevSearchStr = currSearchStr;
    }
  };
}
