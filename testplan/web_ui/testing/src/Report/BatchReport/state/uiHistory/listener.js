import store from '../../../../state/store';
import
  createSearchParamsListener
from '../../../../state/utils-detat/history/createSearchParamsListener';
import uiHistory from './';
import * as uiHistoryActions from './actions';

// @ts-ignore
const listener = createSearchParamsListener(store.dispatch, uiHistoryActions);
export default listener;
export const unlisten = uiHistory.listen(listener);
