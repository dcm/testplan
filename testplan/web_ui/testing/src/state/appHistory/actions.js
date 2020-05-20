import
  createSearchParamSetterThunk
from '../utils-detat/history/createSearchParamSetterThunk';
import appHistory from './';

const __DEV__ = 'production' !== process.env.NODE_ENV;
const __TEST__ = (
  'test' === process.env.NODE_ENV ||
  typeof process.env.CI !== 'undefined'
);

export const setIsDevel =
  createSearchParamSetterThunk({
    actionType: 'SET_DEVEL',
    history: appHistory,
    param: 'showTags',
    transformer: val => __DEV__ ? !!val : false,  // only allow if not in prod
  });

export const setIsTesting =
  createSearchParamSetterThunk({
    actionType: 'SET_TESTING',
    history: appHistory,
    param: 'showTags',
    transformer: val => __TEST__ ? !!val : false,  // only allow if in test
  });
