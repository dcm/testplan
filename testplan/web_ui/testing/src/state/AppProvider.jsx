import React from 'react';
import Provider from 'react-redux/es/components/Provider';
import ErrorCatch from '../Common/ErrorCatch';
import store from './store';

export default function AppProvider({ children }) {
  return (
    <ErrorCatch level='AppProvider'>
      <Provider store={store}>
        {children}
      </Provider>
    </ErrorCatch>
  );
}

