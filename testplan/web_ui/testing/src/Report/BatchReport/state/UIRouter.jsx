import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'react-router';

import ErrorCatch from '../../../Common/ErrorCatch';
import uiHistory from './uiHistory';

const __DEV__ = 'production' !== process.env.NODE_ENV;

const UIRouter = ({ children }) => (
  <ErrorCatch level='UIRouter'>
    <Router history={uiHistory}>
      {children}
    </Router>
  </ErrorCatch>
);

if(__DEV__) {
  UIRouter.propTypes = {
    children: PropTypes.element.isRequired,
  };
}

export default UIRouter;
