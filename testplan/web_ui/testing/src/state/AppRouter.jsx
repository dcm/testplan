import React from 'react';
import { createBrowserHistory } from 'history';
import { createAction } from '@reduxjs/toolkit/dist/redux-toolkit.esm';

import ErrorCatch from '../Common/ErrorCatch';
import createRouterComponents from './utils-detat/createRouterComponents';

export const appHistory = createBrowserHistory({ basename: '/' });

export const setIsDevel = createAction(
  'app/SET_IS_DEVEL',
  (isDevel = false) => ({ payload: !!isDevel })
);

export const setIsTesting = createAction(
  'app/SET_IS_TESTING',
  (isTesting = false) => ({ payload: !!isTesting })
);

const appRouterComponents = createRouterComponents(
  appHistory,
  ['app', 'router'],
  {
    isDevel: setIsDevel,
    isTesting: setIsTesting,
  }
);

export const appRouterActions = appRouterComponents.actions;
export const appRouterSelectors = appRouterComponents.selectors;
export const appRouterReducer = appRouterComponents.reducer;
export const AppRouterBase = appRouterComponents.Router;

export default function AppRouter({ children }) {
  return (
    <ErrorCatch level='AppRouter'>
      <AppRouterBase history={appHistory}>
        {children}
      </AppRouterBase>
    </ErrorCatch>
  );
}
