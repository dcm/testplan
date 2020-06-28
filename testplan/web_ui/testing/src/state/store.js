import { configureStore } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { combineReducers } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { getDefaultMiddleware } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import appMiddleware from './appMiddleware';
import uiMiddleware from '../Report/BatchReport/state/uiMiddleware';

const createReducer = () => combineReducers({
  app: require('./appSlice').default.reducer,
  report: require('../Report/BatchReport/state/reportSlice').default.reducer,
  ui: require('../Report/BatchReport/state/uiSlice').default.reducer,
});

const store = configureStore({
  reducer: createReducer(),
  middleware: [ appMiddleware, uiMiddleware, ...getDefaultMiddleware() ],
});

if(process.env.NODE_ENV !== 'production' && module && module.hot) {
  module.hot.accept(() => store.replaceReducer(createReducer()));
}

export default store;
