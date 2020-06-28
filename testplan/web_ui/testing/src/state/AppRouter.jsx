import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import ErrorCatch from '../Common/ErrorCatch';

export const appHistory = createBrowserHistory({ basename: '/' });

export default function AppRouter({ children }) {
  return (
    <ErrorCatch level='AppRouter'>
      <Router history={appHistory}>
        {children}
      </Router>
    </ErrorCatch>
  );
}
