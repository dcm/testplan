import React from 'react';
import { Router } from 'react-router';
import ErrorCatch from '../Common/ErrorCatch';
import appHistory from './appHistory';

export default function AppRouter({ children }) {
  return (
    <ErrorCatch level='AppRouter'>
      <Router history={appHistory}>
        {children}
      </Router>
    </ErrorCatch>
  );
}
