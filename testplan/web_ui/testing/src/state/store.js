import routerMiddleware from 'connected-react-router/esm/middleware';
import createConnectRouter from 'connected-react-router/esm/reducer';
import { getDefaultMiddleware } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { isImmutableDefault } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { configureStore as _cs } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { setUseProxies } from 'immer/dist/immer.esm';
import { enableMapSet } from 'immer/dist/immer.esm';
// @ts-ignore
import extendConfigureStore from './link/syncStoresEnhancer';
import immerStructure from './struct/immerStructure';
import appSlice from './appSlice';
import appHistory from './appHistory';

const __DEV__ = process.env.NODE_ENV !== 'production',
  DEVTOOLS_NAME = 'App',
  ALLOW_MAP_SET = true;

setUseProxies(true);
if(ALLOW_MAP_SET) enableMapSet();

const store = extendConfigureStore(_cs)({
  reducer: {
    app: appSlice.reducer,
    router: createConnectRouter(immerStructure)(appHistory)
  },
  middleware: [
    // uriSpyMiddleware(uiHistory),  // must be first
    routerMiddleware(appHistory),
    ...getDefaultMiddleware({
      thunk: {
        extraArgument: {
          history: appHistory,
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
  devTools: __DEV__ && {
    shouldCatchErrors: true,
    get name() {
      return this._name || (
        this._name =
          typeof window === 'object'
          && typeof window.document === 'object'
          && typeof window.document.title === 'string'
            ? `${window.document.title} - ${DEVTOOLS_NAME}`
            : DEVTOOLS_NAME
      );
    },
  },
});

// console.warn(store.getState());
// // @ts-ignore
// const uiRouterObjs = store.addSubrouter({
//   history: appHistory,
//   name: 'UIRouter',
// });
// console.warn(store.getState());
// console.log(uiRouterObjs);

export default store;
