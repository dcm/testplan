import React from 'react';
import PropTypes from 'prop-types';
import createConnectedRouter from 'connected-react-router/esm/ConnectedRouter';

import ErrorCatch from '../Common/ErrorCatch';
import AppContext from './AppContext';
import appHistory from './appHistory';
import immerStructure from './struct/immerStructure';

const __DEV__ = 'production' !== process.env.NODE_ENV;
const ConnectedRouter = createConnectedRouter(immerStructure);

const AppRouter = ({ children }) => (
  <ErrorCatch level='AppRouter'>
    <ConnectedRouter history={appHistory} context={AppContext} noInitialPop>
      {children}
    </ConnectedRouter>
  </ErrorCatch>
);

if(__DEV__) {
  AppRouter.propTypes = {
    children: PropTypes.element.isRequired,
  };
}

export default AppRouter;
