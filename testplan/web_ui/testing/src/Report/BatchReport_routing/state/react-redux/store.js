import { configureStore } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { getDefaultMiddleware } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { isImmutableDefault } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { combineReducers } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import routerMiddleware from 'connected-react-router/esm/middleware';
import { setUseProxies } from 'immer/dist/immer.esm';
import { enableMapSet } from 'immer/dist/immer.esm';

import apiSlice from './slices/apiSlice';
import uriSlice from './slices/uriSlice';
import reportSlice from './slices/reportSlice';
import synchronizationSlice from './slices/synchronizationSlice';
import createConnectRouter from 'connected-react-router/esm/reducer';
import immerStructure from '../../../../state/struct/immerStructure';
import uiHistory from './uiHistory';

const ALLOW_MAP_SET = true;
if(ALLOW_MAP_SET) enableMapSet();
setUseProxies(true);
const __DEV__ = process.env.NODE_ENV !== 'production';
const connectRouter = createConnectRouter(immerStructure);

const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
    // app: appSlice.reducer,
    report: reportSlice.reducer,
    uri: uriSlice.reducer,
    synchronization: synchronizationSlice.reducer,
    router: connectRouter(uiHistory),
  },
  middleware: [
    // uriSpyMiddleware(uiHistory),  // must be first
    routerMiddleware(uiHistory),
    ...getDefaultMiddleware({
      thunk: {
        extraArgument: {
          history: uiHistory,
        },
      },
      serializableCheck: __DEV__,
      immutableCheck: __DEV__ && {
        isImmutable: value =>
          (value instanceof Set || value instanceof Map)
            ? ALLOW_MAP_SET
            : isImmutableDefault(value)
      },
    }),
  ],
});

if (__DEV__ && module && module.hot) {
  module.hot.accept(
    [
      './slices/apiSlice', './slices/uriSlice', /* './slices/appSlice',*/
      './slices/reportSlice', './slices/synchronizationSlice',
    ],
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async (mods) => {
      const
        {
          default: { reducer: api }
        } = await import('./slices/apiSlice'),
        {
          default: { reducer: app }
        } = await import('../../../../state/appSlice'),
        {
          default: { reducer: uri }
        } = await import('./slices/uriSlice'),
        {
          default: { reducer: report }
        } = await import('./slices/reportSlice'),
        {
          default: { reducer: synchronization }
        } = await import('./slices/synchronizationSlice'),
        router = connectRouter(uiHistory);
      store.replaceReducer(combineReducers({
        api, app, uri, report, synchronization, router
      }));
    },
  );
}

export default store;
