import React from 'react';
import PropTypes from 'prop-types';
import Provider from 'react-redux/es/components/Provider';
import ErrorCatch from '../Common/ErrorCatch';
import AppContext from './AppContext';
import store from './store';

const __DEV__ = 'production' !== process.env.NODE_ENV;

const AppProvider = ({ children }) => (
  <ErrorCatch level='AppStateProvider'>
    <Provider store={store} context={AppContext}>
      {children}
    </Provider>
  </ErrorCatch>
);
if(__DEV__) {
  AppProvider.propTypes = {
    children: PropTypes.element.isRequired,
  };
}

export default AppProvider;
