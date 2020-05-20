import appSlice from './appSlice';
import * as appHistoryActions from './appHistory/actions';
import ensureUnique from './utils-detat/ensureUnique';

export const {
  setIsDevel,
  setIsTesting
} = ensureUnique(
  appHistoryActions,
  appSlice.actions,
);
