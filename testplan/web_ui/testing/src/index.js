// @ts-nocheck
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter, Route } from 'react-router-dom';
// import { POLL_MS } from './Common/defaults.js';
// import SwitchRequireSlash from './Common/SwitchRequireSlash';
// import LoadingAnimation from './Common/LoadingAnimation';
// import AppProvider from './state/AppProvider';
// import ActualAppRouter from './state/AppRouter';

// // Don't make users download scripts that they won't use.
// // see: https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
// const BatchReport = lazy(() => import('./Report/BatchReport'));
// const BatchReport_routing = lazy(() => import('./Report/BatchReport_routing'));
// const InteractiveReport = lazy(() => import('./Report/InteractiveReport'));
// const EmptyReport = lazy(() => import('./Report/EmptyReport'));
// const Home = lazy(() => import('./Common/Home'));

import { createHashHistory } from 'history';
import { createBrowserHistory } from 'history';
import routerMiddleware from 'connected-react-router/esm/middleware';
import createConnectRouter from 'connected-react-router/esm/reducer';
import { routerActions } from 'connected-react-router/esm/actions';
import { CALL_HISTORY_METHOD } from 'connected-react-router/esm/actions';
import { LOCATION_CHANGE } from 'connected-react-router/esm/actions';
import createConnectedRouter from 'connected-react-router/esm/ConnectedRouter';
import createSelectors from 'connected-react-router/esm/selectors';
import { combineReducers } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { compose } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { createAction } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { applyMiddleware } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { configureStore } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { createSelector } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { createReducer } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { getDefaultMiddleware } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import connect from 'react-redux/es/connect/connect';
import Provider from 'react-redux/es/components/Provider';
import { applyPatches } from 'immer/dist/immer.esm';
import { produceWithPatches } from 'immer/dist/immer.esm';
import { original } from 'immer/dist/immer.esm';
import memoizeWith from 'ramda/es/memoizeWith';
import identity from 'ramda/es/identity';
// @ts-ignore
import syncStoresEnhancer from './state/link/syncStoresEnhancer';
import immerStructure from './state/struct/immerStructure';
import { hashRouterActions } from './state/link/hashUtils';

const
  USE_STORE_SYNC = 1,
  USE_REDIRECT_APPROACH = 2,
  USE_HASH_UTILS = 3;

const USE_APPROACH = USE_STORE_SYNC;


const Counter = ({ count, increment, decrement }) => (
  <section>
    <h3>{`count = ${count}`}</h3>
    <input type='button' onClick={increment} value='+'/>
    <input type='button' onClick={decrement} value='-'/>
  </section>
);

const crrStruct = {
  getIn: (draft, path) => Array.isArray(path) && !!draft
    ? path.reduce((prev, curr) => !!prev ? prev[curr] : undefined, draft)
    : undefined,
  merge: (draft, payload) => { Object.assign(draft, payload); },
  fromJS: val => val,
  toJS: val => val,
};

/**
 *
 */
function mkHashutilsComponent() {
  // hashRouterActions
}


/**
 *
 */
function mkStoreSynchingSubrouter() {


  const createContextConnect = context => (...args) => {
    const options = Object.assign(
      { context },
      args.length > 3 ? args[3] : {},
    );
    const useArgs = Array.from(
      { length: 3 },
      (_, i) => (args[i] || null),
    );
    return connect(...useArgs, options);
  };


  /// SRC //////////////////////////////////////////////////////////////////////
  const srcSlice = createSlice({
    name: 'syncsrc',
    initialState: { count: 100 },
    reducers: {
      decrement(state, action) { --state.count; },
      increment(state, action) { ++state.count; },
    },
  });
  const srcHist = createHashHistory({ basename: '/' });
  const SrcContext = React.createContext(null);
  const ConnectedImmerRouter = createConnectedRouter(immerStructure);
  const ConnectedSrcRouter = props => (
    <ConnectedImmerRouter history={srcHist} context={SrcContext} {...props} />
  );
  // noinspection JSCheckFunctionSignatures
  const srcStore = configureStore({
    reducer: {
      router: createConnectRouter(immerStructure)(srcHist),
      syncsrc: srcSlice.reducer,
    },
    middleware: [
      routerMiddleware(srcHist),
      ...getDefaultMiddleware({}),
    ],
    devtools: { name: 'sync-src-store' },
    enhancers: [
      syncStoresEnhancer('router', immerStructure),
    ],
  });
  const SrcProvider = props => (
    <Provider store={srcStore} context={SrcContext} {...props} />
  );
  const SrcBrainComponent = props => (
    <SrcProvider>
      <ConnectedSrcRouter>
        {props.children}
      </ConnectedSrcRouter>
    </SrcProvider>
  );
  const connectSrc = createContextConnect(SrcContext);
  //////////////////////////////////////////////////////////////////////////////

  /// DEST /////////////////////////////////////////////////////////////////////
  const destSlice = createSlice({
    name: 'syncdest',
    initialState: { count: -5 },
    reducers: {
      decrement(state, action) { --state.count; },
      increment(state, action) { ++state.count; },
    },
  });
  const destHist = createBrowserHistory({ basename: '/a/' });
  const DestContext = React.createContext(null);
  const ConnectedDestRouter = props => (
    <ConnectedImmerRouter history={destHist} context={DestContext} {...props} />
  );
  const destStore = configureStore({
    reducer: {
      router: createConnectRouter(immerStructure)(destHist),
      syncdest: destSlice.reducer,
    },
    middleware: [
      routerMiddleware(destHist),
      ...getDefaultMiddleware({}),
    ],
    devtools: { name: 'sync-dest-store' },
    enhancers: [
      srcStore.sync('hashrouter'),
    ],
  });
  const DestProvider = props => (
    <Provider store={destStore} context={DestContext} {...props} />
  );
  const DestBrainComponent = props => (
    <DestProvider>
      <ConnectedDestRouter>
        {props.children}
      </ConnectedDestRouter>
    </DestProvider>
  );
  const connectDest = createContextConnect(DestContext);
  //////////////////////////////////////////////////////////////////////////////


  /// SETUP ////////////////////////////////////////////////////////////////////
  const SrcComponent = ({ count, increment, decrement, children = null }) => (
    <>
      <h2>got here</h2>
      <Counter count={count} increment={increment} decrement={decrement}/>
      {children}
    </>
  );
  const ConnectedSrcComponent = connectSrc(
    function mapStateToProps(state) {
      return {
        count: state.syncsrc.count,
      };
    },
    function mapDispatchToProps(dispatch) {
      return {
        increment() {
          dispatch((dispatch2, getState) => {
            dispatch2(srcSlice.actions.increment());
            const s2 = getState();
            dispatch2(srcSlice.actions.replace(`/${s2.syncsrc.count}`));
          });
        },
        decrement() {
          dispatch((dispatch2, getState) => {
            dispatch2(srcSlice.actions.decrement());
            const s2 = getState();
            dispatch2(srcSlice.actions.replace(`/${s2.syncsrc.count}`));
          });
        },
      };
    },
    null,
  )(SrcComponent);
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  const DestComponent = ({ count, increment, decrement, children = null }) => (
    <>
      <h1>got here</h1>
      <Counter count={count} increment={increment} decrement={decrement}/>
      {children}
    </>
  );
  const ConnectedDestComponent = connectDest(
    function mapStateToProps(state) {
      return {
        count: state.syncdest.count,
      };
    },
    function mapDispatchToProps(dispatch) {
      return{
        increment() { dispatch(destSlice.actions.increment()); },
        decrement() { dispatch(destSlice.actions.decrement()); },
      };
    },
    null,
  )(DestComponent);
  //////////////////////////////////////////////////////////////////////////////

  return /*NotActuallyAppRouter =*/ () => (
    <DestBrainComponent>
      <ConnectedDestComponent/>
      <SrcBrainComponent>
        <ConnectedSrcComponent/>
      </SrcBrainComponent>
    </DestBrainComponent>
  );
}


/**
 * Maybe fatal: can't get around the fact that connected-react-router
 * will still always update the store with LOCATION_CHANGE, thus a subordinate
 * hash router will / could pick this up
 */
function mkRedirectingConnectedApp() {
// currently '/', could change
  const getSliceActionSeparator = memoizeWith(identity, (_key = null) => {
    const sliceName = 'sliceName', reducerName = 'reducerName';
    const testSlice = createSlice({
      name: sliceName,
      reducers: {
        [reducerName](s, a) { },
      },
    });
    const actionName = testSlice.actions[reducerName].toString();
    return actionName.match(
      new RegExp(`^${sliceName}(?<delim>.*?)${reducerName}$`),
    ).groups.delim;
  });

  const bHist = createBrowserHistory({ basename: '/a/' });
  const bSlice = createSlice({
    name: 'browser',
    initialState: {
      count: 0,
    },
    reducers: {
      decrement(state, action) { --state.count; },
      increment(state, action) { ++state.count; },
    },
  });
  const AppContext = React.createContext(null);
  const StructConnectedRouter = createConnectedRouter(immerStructure);
  const ConnectedBrowserRouter = props => (
    <StructConnectedRouter context={AppContext} history={bHist} {...props}/>
  );

  function createRouterSlice(history, mount, createSliceOptions) {
    const {
      name: origName,
      initialState: origInitialState = {},
      reducers: origReducers = {},
    } = createSliceOptions;
    const reStructure = {
      ...immerStructure,
      getIn: (obj, path = []) => {
        const rePath = (Array.isArray(path) && path[0] === 'router')
          ? [ mount ].concat(path)
          : path;
        return immerStructure.getIn(obj, rePath);
      }
    };
    const reRouterReducer = createConnectRouter(reStructure)(history);
    const sep = getSliceActionSeparator();
    const REROUTE_LOCATION_CHANGE = `${mount}${sep}${LOCATION_CHANGE}`;
    const REROUTE_CALL_HISTORY_METHOD = `${mount}${sep}${CALL_HISTORY_METHOD}`;
    const slice = createSlice({
      ...createSliceOptions,
      initialState: {
        ...origInitialState,
        router: reRouterReducer(),
      },
      reducers: {
        ...origReducers,
        [REROUTE_LOCATION_CHANGE](state, action) {
          return reRouterReducer(state, { ...action, type: LOCATION_CHANGE });
        },
        [REROUTE_CALL_HISTORY_METHOD](state, action) {
          return reRouterReducer(
            state, { ...action, type: CALL_HISTORY_METHOD });
        },
      },
    });
    const { entries, fromEntries, values } = Object;
    const REACTION_CREATORS = fromEntries(
      entries(routerActions).map(([ name, stdActionCreator ]) =>
        [
          `${name}`, createAction(
          `${origName}${getSliceActionSeparator()}${name}`,
          (...args) => stdActionCreator(...args),
        )
        ]
      )
    );
    const MAPPED_TYPES = {
      ...fromEntries(
        values(REACTION_CREATORS).map(v => [ `${v}`, CALL_HISTORY_METHOD ])
      ),
      [slice.actions[REROUTE_CALL_HISTORY_METHOD]]: CALL_HISTORY_METHOD,
      [slice.actions[REROUTE_LOCATION_CHANGE]]: LOCATION_CHANGE,
      [LOCATION_CHANGE]: LOCATION_CHANGE,
      [CALL_HISTORY_METHOD]: CALL_HISTORY_METHOD,
    };
    const stdRouterMiddleware = routerMiddleware(history);
    const reRouterMiddleware = store => next => action => {
      const mappedType = MAPPED_TYPES[action.type];
      if(mappedType) {
        return stdRouterMiddleware(store)(next)(
          { ...action, type: mappedType });
      } else {
        return next(action);
      }
    };
    const ConnectedRouterDefault = createConnectedRouter(reStructure);
    const ConnectedRouter = props => (
      <ConnectedRouterDefault noInitialPop {...props} />
    );
    ConnectedRouter.propTypes = ConnectedRouterDefault.propTypes;
    return {
      ...slice,
      actions: {
        ...slice.actions,  // these are actually action creators
        ...REACTION_CREATORS,
      },
      mount,
      middleware: reRouterMiddleware,
      ConnectedRouter,
    };
  }

  const hHist = createHashHistory({ basename: '/' });
  const hSlice = createRouterSlice(hHist, 'hSlice', {
    name: 'hasher',
    initialState: { hCount: 100 },
    reducers: {
      hDecrement(state, action) { --state.hCount; },
      hIncrement(state, action) { ++state.hCount; },
    },
  });

  const RestructConnectedRouter = hSlice.ConnectedRouter;
  const ConnectedHashRouter = props => (
    <RestructConnectedRouter context={AppContext} history={hHist} {...props}/>
  );
  const store = configureStore({
    reducer: {
      bSlice: bSlice.reducer,
      [hSlice.mount]: hSlice.reducer,
      router: createConnectRouter(immerStructure)(bHist),
    },
    middleware: [
      routerMiddleware(bHist),
      hSlice.middleware,
      ...getDefaultMiddleware({}),
    ],
  });

  const AppProvider = props => (
    <Provider store={store} context={AppContext} {...props}/>
  );

  const connectApp = compose(
    ([ func, desc ]) => Object.defineProperty(func, 'length', desc),
    func => [ func, Object.getOwnPropertyDescriptor(func, 'length') ],
    ([ func, desc ]) => Object.defineProperty(func, 'name', desc),
    func => [ func, Object.getOwnPropertyDescriptor(func, 'name') ],
  )((...args) => {
    const options = Object.assign(
      { context: AppContext },
      args.length > 3 ? args[3] : {},
    );
    const useArgs = Array.from({ length: 3 }, (_, i) => (args[i] || null));
    return connect(...useArgs, options);
  });

  const HashComponent = ({ count, increment, decrement, children = null }) => (
    <>
      <h2>got here</h2>
      <Counter count={count} increment={increment} decrement={decrement}/>
      {children}
    </>
  );
  const ConnectedHashComponent = connectApp(
    state => ({ count: state.hSlice.hCount }),
    dispatch => ({
      increment() {
        dispatch((dispatch2, getState) => {
          dispatch2(hSlice.actions.hIncrement());
          const s2 = getState();
          dispatch2(hSlice.actions.replace(`/${s2.hSlice.hCount}`));
        });
      },
      decrement() {
        dispatch((dispatch2, getState) => {
          dispatch2(hSlice.actions.hDecrement());
          const s2 = getState();
          dispatch2(hSlice.actions.replace(`/${s2.hSlice.hCount}`));
        });
      },
    }),
    null,
  )(HashComponent);

  const BrowserComponent = ({
    count, increment, decrement, children = null
  }) => (
    <>
      <h1>got here</h1>
      <Counter count={count} increment={increment} decrement={decrement}/>
      {children}
    </>
  );
  const ConnectedBrowserComponent = connectApp(
    state => ({ count: state.bSlice.count }),
    dispatch => ({
      increment() { dispatch(bSlice.actions.increment()); },
      decrement() { dispatch(bSlice.actions.decrement()); },
    }),
    null,
  )(BrowserComponent);

  return /*NotActuallyAppRouter =*/ () => (
    <AppProvider>
      <ConnectedBrowserRouter>
        <ConnectedBrowserComponent/>
        <ConnectedHashRouter>
          <ConnectedHashComponent/>
        </ConnectedHashRouter>
      </ConnectedBrowserRouter>
    </AppProvider>
  );
}

let AppRouter = null;
switch(USE_APPROACH) {
  case USE_STORE_SYNC:
    AppRouter = mkStoreSynchingSubrouter();
    break;
  // @ts-ignore
  case USE_HASH_UTILS:
    AppRouter = mkHashutilsComponent();
    break;
  // @ts-ignore
  case USE_REDIRECT_APPROACH:
    AppRouter = mkRedirectingConnectedApp();
    break;
}

// /**
//  * This single App provides multiple functions controlled via the URL path
//  * accessed. We are using React-Router to control which type of report is
//  * rendered and to extract the report UID from the URL when necessary.
//  */
// const AppRouter = () => (
//   <BrowserRouter>
//     <Suspense fallback={<LoadingAnimation/>}>
//       <SwitchRequireSlash>
//         <Route exact path="/" component={Home} />
//         <Route path="/testplan/:uid" render={props =>
//           // eslint-disable-next-line max-len
//           JSON.parse(new URLSearchParams(props.location.search).get('dev') || '')
//             ? <BatchReport_routing {...props} />  // eslint-disable-line react/jsx-pascal-case, max-len
//             : <BatchReport {...props} />
//         } />
//         {/*<Route path="/testplan/:uid" >
//            <BatchReport />
//         </Route>*/}
//         <Route path="/interactive/_dev">
//           <InteractiveReport dev={true} />
//         </Route>
//         <Route path="/interactive">
//           <InteractiveReport dev={false} poll_ms={POLL_MS} />
//         </Route>
//         {/* Must be last */}
//         <Route component={EmptyReport} />
//     </SwitchRequireSlash>
//     </Suspense>
//   </BrowserRouter>
// );

ReactDOM.render(<AppRouter />, document.getElementById('root'));
