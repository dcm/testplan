import React from 'react';
import { createHashHistory } from 'history';
import { Router } from 'react-router';
import ErrorCatch from '../../../Common/ErrorCatch';

export const uiHistory = createHashHistory({ basename: '/' });

export default function UIRouter({ children }) {
  return (
    <ErrorCatch level='UIRouter'>
      <Router history={uiHistory}>
        {children}
      </Router>
    </ErrorCatch>
  );
}
