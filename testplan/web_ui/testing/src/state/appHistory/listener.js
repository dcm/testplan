/* eslint-disable @typescript-eslint/require-await */
import store from '../store';
import
  createSearchParamsListener
  from '../utils-detat/history/createSearchParamsListener';
import appHistory from './';
import * as appHistoryActions from './actions';

/** @desc If we set test mode == true, also set devel mode == true */
const isTestWithDevel = (val, fromListenerCb = false) =>
  async ({ dispatch }) => {
    const bVal = !!val;
    dispatch(appHistoryActions.setIsTesting(bVal, fromListenerCb));
    if(bVal === true) {
      dispatch(appHistoryActions.setIsDevel(bVal, fromListenerCb));
    }
  };

// allow different param values to set devel / test mode
const appHistoryActionsXtra = {
  dev: appHistoryActions.setIsDevel,
  isDev: appHistoryActions.setIsDevel,
  devel: appHistoryActions.setIsDevel,
  isDevel: appHistoryActions.setIsDevel,
  development: appHistoryActions.setIsDevel,
  isDevelopment: appHistoryActions.setIsDevel,
  test: isTestWithDevel,
  isTest: isTestWithDevel,
  testing: isTestWithDevel,
  isTesting: isTestWithDevel,
  testOnly: appHistoryActions.setIsTesting,
  isTestOnly: appHistoryActions.setIsTesting,
  testingOnly: appHistoryActions.setIsTesting,
  isTestingOnly: appHistoryActions.setIsTesting,
};

export const listener = createSearchParamsListener(
  store.dispatch,
  // @ts-ignore
  appHistoryActionsXtra
);
export const unlisten = appHistory.listen(listener);
