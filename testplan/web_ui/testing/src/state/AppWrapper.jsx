import React from 'react';
import LoadingAnimation from '../Common/LoadingAnimation';
import AppRouter from './AppRouter';
import AppProvider from './AppProvider';
import ErrorCatch from '../Common/ErrorCatch';

export default function AppWrapper({ children }) {
  return (
    <React.StrictMode>
      <ErrorCatch level='AppWrapper'>
          <AppProvider>
            <AppRouter>
              <React.Suspense fallback={<LoadingAnimation/>}>
                {children}
              </React.Suspense>
            </AppRouter>
          </AppProvider>
      </ErrorCatch>
    </React.StrictMode>
  );
}
