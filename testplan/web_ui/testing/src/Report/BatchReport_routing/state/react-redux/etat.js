// @ts-nocheck
// import {
//   flattenMap, mapToQueryString, queryStringToEntriesGenerator, reverseMap
// } from '../../../Common/utils';
// import { createMemoryHistory } from 'history';

// const __DEV__ = process.env.NODE_ENV !== 'production';
// const __TEST__ = process.env.NODE_ENV === 'test';

// /** @typedef {typeof import("../utils/filterStates")} FilterStates */
// /** @typedef {import("@reduxjs/toolkit")} ReduxToolkit */
// /** @typedef {import("redux")} Redux */
// /** @typedef {(any|string|number|boolean|null|symbol|BigInt)} ActuallyAny */
// /** @typedef {ReturnType<createSlice>['actions']} CaseReducerActions */
// /** @template T @typedef {T | T[]} MaybeArray<T> */

// export const appRouterSlice = createSlice({
//   name: 'appRouter',
//   /** @see https://github.com/ReactTraining/history/blob/master/docs/GettingStarted.md#properties */
//   initialState: {  // BrowserRouter at time of writing
//     length: null,
//     location: null,
//     action: null,
//     state: null,
//     key: null,
//   },
//   reducers: {
//     setHistoryLength: {
//       reducer(state, { payload: historyLength }) {
//         state.length = historyLength;
//       },
//       prepare: (historyLength) => ({ payload: historyLength }),
//     },
//     setLocation: {
//       reducer(state, { payload: location }) {
//         state.location = location;
//       },
//       prepare: (location) => ({ payload: location }),
//     },
//     setLastAction: {
//       reducer(state, { payload: lastAction }) {
//         state.action = lastAction;
//       },
//       prepare: (lastAction) => ({ payload: lastAction }),
//     },
//     setHistoryState: {
//       reducer(state, { payload: locationState }) {
//         state.state = locationState;
//       },
//       prepare: (locationState) => ({ payload: locationState }),
//     },
//     setHistoryKey: {
//       reducer(state, { payload: locationKey }) {
//         state.key = locationKey;
//       },
//       prepare: (locationKey) => ({ payload: locationKey }),
//     },
//   },
// });
//
// export const uiRouterSlice = createSlice({
//   name: 'uiRouter',
//   /** @see https://github.com/ReactTraining/history/blob/master/docs/GettingStarted.md#properties */
//   initialState: {  // HashRouter at time of writing
//     length: uiHistory.length,
//     location: uiHistory.location,
//     action: uiHistory.action,
//   },
//   reducers: {
//     setHistoryLength: {
//       reducer(state, { payload: historyLength }) {
//         state.length = historyLength;
//       },
//       prepare: historyLength => ({ payload: historyLength }),
//     },
//     setLocation: {
//       reducer(state, { payload: location }) {
//         state.location = location;
//       },
//       prepare: (location) => ({ payload: location }),
//     },
//     setLastAction: {
//       reducer(state, { payload: lastAction }) {
//         state.action = lastAction;
//       },
//       prepare: (lastAction) => ({ payload: lastAction }),
//     },
//   },
// });
//
// const queryActionMap = (() => {  // closure to keep variables under control...
//   // we're assigning values like this since webpack's terser will remove
//   // the unreachable blocks as dead code so there's no risk of any of these
//   // being triggered in production
//   const isTestingURLParams = [], isDevURLParams = [];
//   if(__DEV__) {
//     isDevURLParams.push(
//       'dev', 'devel', 'isDev', 'isDevel', 'development', 'isDevelopment',
//     );
//     if(__TEST__) {
//       isTestingURLParams.push('test', 'testing', 'isTest', 'isTesting');
//     }
//   }
//   /** these must be 1-1, else we'll lose values when we reverse them */
//   const appQueryToActionsMap = new Map([
//       [ isTestingURLParams, appSlice.actions.setTesting ],
//       [ isDevURLParams, appSlice.actions.setDevel ],
//     ]),
//     uiQueryToActionsMap = new Map([
//       [ 'displayEmpty', reportSlice.actions.setDisplayEmpty ],
//       [ 'filter', reportSlice.actions.setFilter ],
//       [ 'showTags', reportSlice.actions.setShowTags ],
//       [ 'doAutoSelect', reportSlice.actions.setDoAutoSelect ],
//     ]),
//     fat = {
//       uiQuery: {
//         to: {
//           actions: uiQueryToActionsMap,
//         },
//         from: {
//           actions: reverseMap(uiQueryToActionsMap),
//         },
//       },
//       appQuery: {
//         to: {
//           actions: appQueryToActionsMap,
//         },
//         from: {
//           actions: reverseMap(appQueryToActionsMap),
//         },
//       },
//     },
//     part = {
//       uiQuery: {
//         to: {
//           actions: flattenMap(fat.uiQuery.to.actions),
//         },
//         from: {
//           actions: flattenMap(fat.uiQuery.from.actions, a => a.type),
//         },
//       },
//       appQuery: {
//         to: {
//           actions: flattenMap(fat.appQuery.to.actions),
//         },
//         from: {
//           actions: flattenMap(fat.appQuery.from.actions, a => a.type),
//         },
//       }
//     },
//     _queryActionMap = {
//       ...part,
//       actions: {
//         to: {
//           uiQuery: part.uiQuery.from.actions,
//           appQuery: part.appQuery.from.actions,
//         },
//         from: {
//           uiQuery: part.uiQuery.to.actions,
//           appQuery: part.appQuery.to.actions,
//         },
//       },
//       fat: {
//         ...fat,
//         actions: {
//           to: {
//             uiQuery: fat.uiQuery.from.actions,
//             appQuery: fat.appQuery.from.actions,
//           },
//           from: {
//             uiQuery: fat.uiQuery.to.actions,
//             appQuery: fat.appQuery.to.actions,
//           },
//         },
//       },
//     };
//   if(__DEV__) {
//     const sizeTestObj = {
//       appQueryToActionsMap: [  // all these should be the same size
//         _queryActionMap.fat.appQuery.to.actions.size,
//         _queryActionMap.fat.actions.to.appQuery.size,
//         _queryActionMap.fat.appQuery.from.actions.size,
//         _queryActionMap.fat.actions.from.appQuery.size,
//       ],
//       uiQueryToActionsMap: [  // all these should be the same size
//         _queryActionMap.fat.uiQuery.to.actions.size,
//         _queryActionMap.fat.actions.to.uiQuery.size,
//         _queryActionMap.fat.uiQuery.from.actions.size,
//         _queryActionMap.fat.actions.from.uiQuery.size,
//       ],
//     };
//     for(const [rootObjName, szArr] of Object.entries(sizeTestObj)) {
//       let prevSz = -1;
//       for(const sz of szArr) {
//         if(prevSz !== -1 && prevSz !== sz) {
//           throw new Error(`\`${rootObjName}\` is not a 1-1 mapping`);
//         }
//         prevSz = sz;
//       }
//     }
//   }
//   return _queryActionMap;
// })();
// //////// proxy history listeners - conditionally push to actual history ////////
// const uiHistoryProxy = createMemoryHistory({
//   initialEntries: [ uiHistory.createHref(uiHistory.location) ]
// });
// const appHistoryProxy = createMemoryHistory({
//   // TODO: get browser history object
// });
//
// /**
//  * We use memory history as a proxy for the actual history because it has a
//  * location-specific state and doesn't depend on anything externally (e.g. DOM)
//  * to work. This lets us "communicate" between different events.
//  *
//  * For example, note these facts:
//  * (1) `routerHistory` will scan passing actions to check whether their
//  *     dispatch indicates that the URL should should have a query param set. If
//  *     it does, it will push an new location to the appropriate proxy router. It
//  *     will also set the `byDispatch` prop in the state.
//  * (2) `uiHistoryProxy` and `appHistoryProxy`, or "proxy histories", listen for
//  *     changes to their own histories. Sometimes - if the change is emanating
//  *     from somewhere other than the browser (e.g. pushed from middleware) -
//  *     they will be the first to know about a location change and will need to
//  *     pass the new location up to the actual histories.
//  * (3) `uiHistory` and `appHistory`, or "actual histories", similarly listen for
//  *     changes to their own histories. Whenever there is a location change
//  *     emanating from the browser, they will push that same change to the
//  *     proxy histories.
//  *
//  * A naive setup would quickly give us an infinite loop:
//  * > a proxy history receives a change from an actual history
//  * > it pushed that same change to the actual history
//  * > actual history replicates that change back to proxy history
//  * > etc forever
//  *
//  * But why use a proxy at all?
//  *
//  * Because hash history does not have a location-specific state, so
//  * we would be in the situation that:
//  * > hash history sees from the browser that the URL has changed in such a way
//  *   as to trigger an action dispatch
//  * > hash history dispatches that action
//  * > since the Action <=> query param mappings are 1-1, this means that the
//  *   action hash history dispatched will be picked up by `routerMiddleware`
//  * > hash history has no way of telling the middleware to not set the URL per
//  *   the action mapping
//  * > So it would set the URL > hash history would think that change implies
//  *   a dispatch > the dispatch is picked up by the middleware > middleware sets
//  *   the URL > hash history would think that change implies a dispatch > ...
//  *
//  * So how do we coordinate the two histories and middleware?
//  * I. Proxy history is the nexus between the middleware and the actual history
//  * II. When a location is pushed to the proxy history from the middleware:
//  *     i. The middleware sets the state to { fromMiddleware: true }
//  *     ii. Once this new location reaches the proxy history listener, it
//  *         checks if state.fromMiddleware is truthy it pushes the same location
//  *         to the actual history
//  *     iii. This triggers the actual history listener, which checks the proxy
//  *          history's current state (which shouldn't have changed in the
//  *          meantime)
//  *          TODO: finish writing this
//  *
//  */
// const unlistenUIHistoryProxy = (() => {
//   let lastByDispatch = null;
//   let prevSearch = '';
//   uiHistoryProxy.listen(({ state, ...location }, action) => {
//
//     const { noMirror = false, byDispatch = null } = state;
//     if(byDispatch !== lastByDispatch && typeof byDispatch === 'object') {
//       // `byDispatch` is only set whenever `routerMiddleware` dispatches history
//       // changing thunks
//       lastByDispatch = byDispatch;
//     }
//
//     switch(action) {  // eslint-disable-line default-case
//       case 'POP':
//         break;
//       case 'PUSH':
//         uiHistory.push(location);
//         break;
//       case 'REPLACE':
//         uiHistory.replace(location);
//         break;
//     }
//
//     const { search } = location;
//     if(prevSearch === search) return;
//     prevSearch = search;
//     const dispatchedActions = new Set();  // dont dispatch actions twice
//     for(const [param, val] of queryStringToEntriesGenerator(search)) {
//       const actionsArray = queryActionMap.uiQuery.to.actions.get(param);
//       if(!actionsArray) continue;
//       const { dispatch } = store;
//       for(const action of actionsArray) {
//         if(dispatchedActions.has(action.type)) continue;
//         dispatch(action(val));
//         dispatchedActions.add(action.type);
//       }
//     }
//
//   });
// })();
// const unlistenAppHistoryProxy = (() => {
//   let lastByDispatch = null;
//   return appHistoryProxy.listen(({ state, ...location }, action) => {
//     const { noMirror = false, byDispatch = null } = state;
//     if(byDispatch !== lastByDispatch && typeof byDispatch === 'object') {
//       lastByDispatch = byDispatch;
//
//     }
//     switch(action) {  // eslint-disable-line default-case
//       case 'POP':
//         break;
//       case 'PUSH':
//         break;
//       case 'REPLACE':
//         break;
//     }
//   });
// })();
// ////////////////////////////////////////////////////////////////////////////////
//
// //////// actual history listeners - conditionally push to proxy history ////////
// const unlistenUIHistory = (() => {
//   return uiHistory.listen((location, action) => {
//     const newProxyLocation = {
//       ...location,
//       state: {
//         ...uiHistoryProxy.location.state,
//         fromActual: true,
//       }
//     };
//     switch(action) {  // eslint-disable-line default-case
//       case 'POP':
//         break;
//       case 'PUSH':
//         uiHistoryProxy.push(location);
//         break;
//       case 'REPLACE':
//         uiHistoryProxy.replace(location);
//         break;
//     }
//   });
// })();
// const unlistenAppHistory = (() => {
//   // let prevSearch = '';
//   // return appHistory.listen(({ search }) => {
//   //   if(prevSearch === search) return;
//   //   prevSearch = search;
//   //   const dispatchedActions = new Set();  // dont dispatch actions twice
//   //   for(const [param, val] of queryStringToEntriesGenerator(search)) {
//   //     const actionsArray = appQueryToActionsFlatMap.get(param);
//   //     if(!actionsArray) continue;
//   //     const { dispatch } = store;
//   //     for(const action of actionsArray) {
//   //       if(dispatchedActions.has(action.type)) continue;
//   //       dispatch(action(val));
//   //       dispatchedActions.add(action.type);
//   //     }
//   //   }
//   // });
// })();
// ////////////////////////////////////////////////////////////////////////////////
//
// /**
//  * Takes a {@link MapConstructor|Map} of
//  * <URL query string parameters> => <state keys>
//  * and returns a function that accepts a state object and action object, which
//  * will efficiently assign the query parameter value to the mapped entry in the
//  * state.
//  * @param {Map<string, string>} queryToStateMap -
//  *     Map of <possible query parameters> => <corresponding state key>
//  * @param {Object.<string, function(any): boolean>} [queryValidators=undefined] -
//  *     Object of functions that will be called with the matched query value
//  *     to determine whether or not to go ahead with adding the value to the
//  *     state.
//  * @returns {ReduxToolkit.SliceCaseReducersCheck['reducer']} -
//  *     Function that can be used as a reducer to map query params to state
//  */
// function mapParsedURLQueryToStatePartial(queryToStateMap, queryValidators) {
//   if(!(queryToStateMap instanceof Map)) {
//     throw new Error('You must pass in an ES6 Map object');
//   }
//   const paramToStateMap = new Map(queryToStateMap);
//   const stateKeySet = new Set(paramToStateMap.values());
//   return function mapParsedURLQueryToState(state, { payload: parsedQuery }) {
//     for(const [ param, val ] of Object.entries(parsedQuery)) {
//       const stateKey = paramToStateMap.get(param);
//       if(stateKey) {
//         let goAhead = true, validator;
//         if(queryValidators) {
//           validator = queryValidators[stateKey];
//         }
//         if(typeof validator === 'function') {
//           goAhead = validator(val);
//         }
//         if(goAhead) {
//           state[stateKey] = !!val;
//         }
//         paramToStateMap.delete(param);
//         stateKeySet.delete(stateKey);
//       }
//       if(stateKeySet.size === 0 || queryToStateMap.size === 0) break;
//     }
//   };
// }
//
// /**
//  * BROWSER-INITIATED LOCATION CHANGE
//  * =================================
//  * <1. location change>                                      <4. stateless listener reads {nomirror: true} and quits>
//  *     | |                                                                          /\
//  *     | |                                                                         /  \
//  *     | |                                                                         | |
//  *     | |                                                                         | |
//  * (stateless history listener)                                           (stateless history listener)
//  *     | |                                                                         | |
//  *     | |                                                                         | |
//  *     | |                                                                         | |
//  *     | |                                                                         | |
//  *    \   /                                                                        | |
//  *     \/                                                                          | |
//  * <2. stateless loc updated> === (stateful history listener) ===> <3. stateful loc updated + "nomirror" state entry>
//  */
// /**
//  * DISPATCH-INITIATED LOCATION CHANGE
//  * ==================================
//  * <1. action dispatched>
//  *     | |
//  *     | |
//  *     | |
//  *     | |
//  * (middleware listener)
//  *     | |
//  *     | |
//  *     | |
//  *     | |
//  *    \   /
//  *     \/
//  * <2:
//  * - location-connected action detected
//  * - new location state created:
//  *   {
//  *     byDispatch: {
//  *       pathname: null,
//  *       search: null,
//  *       hash: null,
//  *     }
//  *   }
//  * - new location + state pushed to stateful history
//  * >   | |                                | |
//  *     | |                                | |
//  * (stateless history listener)   (stateful history listener)
//  *     | |                                | |
//  *     | |                                | |
//  *     | |                               \   /
//  *     | |                                \/
//  *    \   /                       <note made of `byDispatch`>
//  *     \/                                 | |                              <quit if changes match `byDispatch`>
//  *   <location pushed>                    | |                                               /\
//  *                                        | |                                             /   \
//  *                                       \   /                                            | |
//  *                                        \/                                              | |
//  *                                 <location change noticed> =======> <new location compared against `byDispatch`>
//  */
//
// /** @see node_modules/redux/index.d.ts:450 */
// const routerMiddleware = ({ dispatch, getState }) => {
//   return (next) => {
//     return (action) => {
//       next(action);  // dispatch the original action before anything
//       const
//         actionUIQueryArr = queryActionMap.actions.to.uiQuery.get(action.type),
//         actionAppQueryArr = queryActionMap.actions.to.appQuery.get(action.type);
//       if(actionUIQueryArr || actionAppQueryArr) {
//         const { payload } = action, pushLocationPromises = [];
//         async function _setLocation(queryParamArr, statefulHistObj) {
//           const paramValMap = new Map();
//           for(const queryParam of queryParamArr)
//             paramValMap.set(queryParam, payload);
//           const qs = mapToQueryString(paramValMap);
//           const byDispatch = { ...statefulHistObj.location, search: qs };
//           await statefulHistObj.push({ ...byDispatch, state: { byDispatch } });
//         }
//         // the history props are the proxy histories
//         dispatch(async (_dispatch, _getState, { history: { ui, app } }) => {
//           try {
//             if(actionUIQueryArr && ui)
//               pushLocationPromises.push(_setLocation(actionUIQueryArr, ui));
//             if(actionAppQueryArr && app)
//               pushLocationPromises.push(_setLocation(actionAppQueryArr, app));
//             return await Promise.allSettled(pushLocationPromises);
//           } catch(errors) {
//             for(const err_2 of errors) {
//               if(__DEV__) console.error(err_2);
//               else console.warn(err_2);
//             }
//           }
//         });
//       }
//     };
//   };
// };
