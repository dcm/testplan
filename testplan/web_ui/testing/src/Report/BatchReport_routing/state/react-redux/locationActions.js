import appSlice from '../../../../state/appSlice';
import reportSlice from './slices/reportSlice';
import {
  reverseMap, flattenMap, mapToQueryString,
} from '../../../../Common/utils';

const __DEV__ = process.env.NODE_ENV !== 'production';
const __TEST__ = process.env.NODE_ENV === 'test';

const queryActionMap = (() => {  // closure to keep variables under control...
  // we're assigning values like this since webpack's terser will remove
  // the unreachable blocks as dead code so there's no risk of any of these
  // being triggered in production
  const isTestingURLParams = [], isDevURLParams = [];
  if(__DEV__) {
    isDevURLParams.push(
      'dev', 'devel', 'isDev', 'isDevel', 'development', 'isDevelopment',
    );
    if(__TEST__) {
      isTestingURLParams.push('test', 'testing', 'isTest', 'isTesting');
    }
  }
  /** these must be 1-1, else we'll lose values when we reverse them */
  const appQueryToActionsMap = new Map([
      [ isTestingURLParams, appSlice.actions.setTesting ],
      [ isDevURLParams, appSlice.actions.setDevel ],
    ]),
    uiQueryToActionsMap = new Map([
      [ 'displayEmpty', reportSlice.actions.setDisplayEmpty ],
      [ 'filter', reportSlice.actions.setFilter ],
      [ 'showTags', reportSlice.actions.setShowTags ],
      [ 'doAutoSelect', reportSlice.actions.setDoAutoSelect ],
    ]),
    fat = {
      uiQuery: {
        to: {
          actions: uiQueryToActionsMap,
        },
        from: {
          actions: reverseMap(uiQueryToActionsMap),
        },
      },
      appQuery: {
        to: {
          actions: appQueryToActionsMap,
        },
        from: {
          actions: reverseMap(appQueryToActionsMap),
        },
      },
    },
    part = {
      uiQuery: {
        to: {
          actions: flattenMap(fat.uiQuery.to.actions),
        },
        from: {
          actions: flattenMap(fat.uiQuery.from.actions, a => a.type),
        },
      },
      appQuery: {
        to: {
          actions: flattenMap(fat.appQuery.to.actions),
        },
        from: {
          actions: flattenMap(fat.appQuery.from.actions, a => a.type),
        },
      }
    },
    _queryActionMap = {
      ...part,
      actions: {
        to: {
          uiQuery: part.uiQuery.from.actions,
          appQuery: part.appQuery.from.actions,
        },
        from: {
          uiQuery: part.uiQuery.to.actions,
          appQuery: part.appQuery.to.actions,
        },
      },
      fat: {
        ...fat,
        actions: {
          to: {
            uiQuery: fat.uiQuery.from.actions,
            appQuery: fat.appQuery.from.actions,
          },
          from: {
            uiQuery: fat.uiQuery.to.actions,
            appQuery: fat.appQuery.to.actions,
          },
        },
      },
    };
  if(__DEV__) {
    const sizeTestObj = {
      appQueryToActionsMap: [  // all these should be the same size
        _queryActionMap.fat.appQuery.to.actions.size,
        _queryActionMap.fat.actions.to.appQuery.size,
        _queryActionMap.fat.appQuery.from.actions.size,
        _queryActionMap.fat.actions.from.appQuery.size,
      ],
      uiQueryToActionsMap: [  // all these should be the same size
        _queryActionMap.fat.uiQuery.to.actions.size,
        _queryActionMap.fat.actions.to.uiQuery.size,
        _queryActionMap.fat.uiQuery.from.actions.size,
        _queryActionMap.fat.actions.from.uiQuery.size,
      ],
    };
    for(const [rootObjName, szArr] of Object.entries(sizeTestObj)) {
      let prevSz = -1;
      for(const sz of szArr) {
        if(prevSz !== -1 && prevSz !== sz) {
          throw new Error(`\`${rootObjName}\` is not a 1-1 mapping`);
        }
        prevSz = sz;
      }
    }
  }
  return _queryActionMap;
})();

/** @see node_modules/redux/index.d.ts:450 */
const routerMiddleware = ({ dispatch, getState }) => {
  return (next) => {
    return (action) => {
      next(action);  // dispatch the original action before anything
      const
        actionUIQueryArr = queryActionMap.actions.to.uiQuery.get(action.type),
        actionAppQueryArr = queryActionMap.actions.to.appQuery.get(action.type);
      if(actionUIQueryArr || actionAppQueryArr) {
        const { payload } = action, pushLocationPromises = [];
        async function _setLocation(queryParamArr, statefulHistObj) {
          const paramValMap = new Map();
          for(const queryParam of queryParamArr)
            paramValMap.set(queryParam, payload);
          const qs = mapToQueryString(paramValMap);
          const byDispatch = { ...statefulHistObj.location, search: qs };
          await statefulHistObj.push({ ...byDispatch, state: { byDispatch } });
        }
        // the history props are the proxy histories
        dispatch(async (_dispatch, _getState, { history: { ui, app } }) => {
          try {
            if(actionUIQueryArr && ui)
              pushLocationPromises.push(_setLocation(actionUIQueryArr, ui));
            if(actionAppQueryArr && app)
              pushLocationPromises.push(_setLocation(actionAppQueryArr, app));
            return await Promise.allSettled(pushLocationPromises);
          } catch(errors) {
            for(const err_2 of errors) {
              if(__DEV__) console.error(err_2);
              else console.warn(err_2);
            }
          }
        });
      }
    };
  };
};
