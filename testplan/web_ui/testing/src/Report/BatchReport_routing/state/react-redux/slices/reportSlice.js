import { createSlice } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { LOCATION_CHANGE } from 'connected-react-router/esm/actions';
import { CALL_HISTORY_METHOD } from 'connected-react-router/esm/actions';
import * as filterStates from '../../../utils/filterStates';
import wrapActionCreators from 'react-redux/es/utils/wrapActionCreators';
import { createLocation } from 'history';
import { locationsAreEqual } from 'history';
import { getParsedSearchPure } from '../selectors/selectors';

const __DEV__ = process.env.NODE_ENV !== 'production';

/** @typedef {(any|string|number|boolean|null|symbol|BigInt)} ActuallyAny */
/** @typedef {typeof import("../../../utils/filterStates")} FilterStates */

const isValidFilter = (() => {  // control local vars
  const filterStatesArr = Object.values(filterStates);
  return (maybeFilterState) => {
    filterStatesArr.includes(maybeFilterState);
    const isValid = filterStatesArr.includes(maybeFilterState);
    if(!isValid) {
      const msg = `"${maybeFilterState}" is not a valid filter.`;
      if(__DEV__) throw new Error(msg);
      console.warn(msg);
    }
    return isValid;
  };
})();

const queryParamMappingComparator = (el1, el2) =>
  (el1.ci || el2.ci)
    ? (el1.param.toLowerCase().localeCompare(el2.param.toLowerCase()))
    : el1.param.localeCompare(el2.param);

const parsedSearchEntriesComparator = (arr1, arr2) =>
  arr2[0].localeCompare(arr1[0]);

const queryParamSetterMapping =  [
  {
    param: 'displayEmpty',
    setter(state, param, val) {
      state.isDisplayEmpty = val;
    },
    ci: true
  },
  {
    param: 'filter',
    setter(state, param, val) {
      state.filter = val;
    },
    ci: true
  },
  {
    param: 'showTags',
    setter(state, param, val) {
      state.isShowTags = val;
    },
    ci: true
  },
  {
    param: 'doAutoSelect',
    setter(state, param, val) {
      state.doAutoSelect = val;
    }
  },
].sort(queryParamMappingComparator);

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    /** @type {boolean} */
    isShowHelpModal: false,
    /** @type {boolean} */
    isDisplayEmpty: true,
    /** @type {string} */
    centerPanelPlaceholderMessage: 'Please select an entry.',
    /** @type {FilterStates[keyof FilterStates]} @default */
    //@ts-ignore
    filter: filterStates.ALL,
    /** @type {boolean} */
    isFetching: false,
    /** @type {string} */
    isFetchingMessage: 'Fetching Testplan report...',
    /** @type {boolean} */
    isLoading: false,
    /** @type {string} */
    isLoadingMessage: 'Waiting to fetch Testplan report...',
    /** @type {null | Error} */
    fetchError: null,
    /** @type {string} */
    fetchErrorMessagePrelude: 'Error fetching Testplan report.',
    /** @type {boolean} */
    isShowTags: false,
    /** @type {null | Object.<string, any>} */
    jsonReport: null,
    /** @type {boolean} */
    isShowInfoModal: false,
    /** @type {null | Object.<string, ActuallyAny>} */
    selectedTestCase: null,
    /** @type {boolean} */
    doAutoSelect: true,
    /** @type {Object.<string, ActuallyAny>} */
    _pendingProgrammaticSet: [],
  },
  reducers: {
    /**
     * @param {object} state
     * @param {object} action
     * @param {boolean} action.payload
     */
    setShowHelpModal: {
      reducer(state, { payload: boolable }) {
        state.isShowHelpModal = !!boolable;
      },
      prepare: (boolable) => ({ payload: boolable }),
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {boolean} action.payload
     */
    setDisplayEmpty: {
      reducer(state, { payload: boolable }) {
        state.isDisplayEmpty = !!boolable;
      },
      prepare: (boolable) => ({ payload: boolable }),
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {string} action.payload
     */
    setCenterPanelPlaceholderMessage: {
      reducer(state, { payload: message }) {
        if(message) {
          state.centerPanelPlaceholderMessage = `${message}`;
        }
      },
      prepare: (message) => ({ payload: message }),
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {FilterStates[keyof FilterStates]} action.payload
     */
    setFilter: {
      reducer(state, { payload: filterState }) {
        if(isValidFilter(filterState)) {
          state.filter = filterState;
        }
      },
      prepare: (filterState) => ({ payload: filterState }),
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {boolean} action.payload
     */
    setFetching: {
      reducer(state, { payload: boolable }) {
        state.isFetching = !!boolable;
      },
      prepare: (boolable) => ({ payload: boolable }),
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {string} action.payload
     */
    setFetchingMessage: {
      reducer(state, { payload: message }) {
        if(message) {
          state.isFetchingMessage = `${message}`;
        }
      },
      prepare: (message) => ({ payload: message }),
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {boolean} action.payload
     */
    setLoading: {
      reducer(state, { payload: boolable }) {
        state.isLoading = !!boolable;
      },
      prepare: (boolable) => ({ payload: boolable }),
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {string} action.payload
     */
    setLoadingMessage: {
      reducer(state, { payload: message }) {
        if(message) {
          state.isLoadingMessage = `${message}`;
        }
      },
      prepare: (message) => ({ payload: message }),
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {string | Error | null} [action.payload=null]
     */
    setFetchError: {
      reducer(state, { payload: error = null }) {
        // @ts-ignore
        state.fetchError = (error instanceof Error) ?
          (`${error.message}` + (__DEV__ ? `\n${error.stack}` : ''))
          : (typeof error === 'string') ? error
            : (error === undefined || error === null) ? null
              : `${error}`;
      },
      prepare: (error) => ({ payload: error }),
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {string} action.payload
     */
    setFetchErrorMessagePrelude: {
      reducer(state, { payload: prelude }) {
        state.fetchErrorMessagePrelude = `${prelude}`;
      },
      prepare: (prelude) => ({ payload: prelude }),
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {boolean} action.payload
     */
    setShowTags: {
      reducer(state, { payload: boolable }) {
        state.isShowTags = !!boolable;
      },
      prepare: (boolable) => ({ payload: boolable }),
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {object} action.payload
     */
    setJsonReport: {
      reducer(state, { payload: jsonReport }) {
        state.jsonReport = jsonReport;
      },
      prepare: (jsonReport) => ({ payload: jsonReport }),
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {boolean} action.payload
     */
    setShowInfoModal: {
      reducer(state, { payload: boolable }) {
        state.isShowInfoModal = !!boolable;
      },
      prepare: (boolable) => ({ payload: boolable }),
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {null | Object.<string, ActuallyAny>} action.payload
     */
    setSelectedTestCase: {
      reducer(state, { payload: message }) {
        state.selectedTestCase = message;
      },
      prepare: (message) => ({ payload: message }),
    },
    /**
     * @param {object} state
     * @param {object} action
     * @param {boolean} action.payload
     */
    setDoAutoSelect: {
      reducer(state, { payload: boolable }) {
        state.doAutoSelect = !!boolable;
      },
      prepare: (boolable) => ({ payload: boolable }),
    },
  },
  extraReducers: {
    [CALL_HISTORY_METHOD](state, payload) {
      const { method, args } = payload;
      switch(method) {
        case 'push':
        case 'replace':
          const nextLoc = Array.isArray(args) ? args[0] : args;
          const nextLocObj = typeof nextLoc === 'string'
            ? createLocation(nextLoc)
            : nextLoc;
          state._pendingProgrammaticSet.push(nextLocObj);
          break;
        case 'go':  // no location passed
        case 'goBack':
        case 'goForward':
          break;
        default:
          break;
      }
    },
    [LOCATION_CHANGE](state, payload) {
      const { location: loc, action, isFirstRendering } = payload;
      switch(action) {
        case 'PUSH':  // `push(location)`
        case 'REPLACE':  // `replace(location)`
          const locObj = typeof loc === 'string' ? createLocation(loc) : loc;
          const pendingLocationIdxs = [];
          if(!isFirstRendering) {
            for(let i = 0; i < state._pendingProgrammaticSet.length; ++i) {
              const pendingLoc = state._pendingProgrammaticSet[i];
              if(locationsAreEqual(locObj, pendingLoc)) {
                pendingLocationIdxs.push(i);
              }
            }
            if(pendingLocationIdxs.length !== 0) {
              for(let i = pendingLocationIdxs.length - 1; i >= 0; --i) {
                const rmIdx = pendingLocationIdxs[i];
                state._pendingProgrammaticSet.splice(rmIdx, 1);
              }
              break;
            }
          }
          const parsedSearchObj = getParsedSearchPure(locObj.search);
          const paramValEntries = Object.entries(parsedSearchObj).sort(
            parsedSearchEntriesComparator
          );
          for(const [param, val] of paramValEntries) {
            const mappedSetterMap = queryParamSetterMapping.find(mapp =>
              mapp.ci ? (mapp.param.toLowerCase() === param.toLowerCase()) :
                mapp.param === param
            );
            if(mappedSetterMap) {
              const { setter } = mappedSetterMap;
              setter(state, param, val);
            }
          }
          break;
        case 'POP':  // `go(num)` / `goBack()` / `goForward()`, no stored loc
          break;
        default:
          break;
      }
    },
  },
});


export const {
  setDoAutoSelect: bare_setDoAutoSelect,
  setShowTags: bare_setShowTags,
  setFilter: bare_setFilter,
  setCenterPanelPlaceholderMessage: bare_setCenterPanelPlaceholderMessage,
  setDisplayEmpty: bare_setDisplayEmpty,
  setFetchError: bare_setFetchError,
  setFetchErrorMessagePrelude: bare_setFetchErrorMessagePrelude,
  setFetching: bare_setFetching,
  setFetchingMessage: bare_setFetchingMessage,
  setJsonReport: bare_setJsonReport,
  setLoading: bare_setLoading,
  setLoadingMessage: bare_setLoadingMessage,
  setSelectedTestCase: bare_setSelectedTestCase,
  setShowHelpModal: bare_setShowHelpModal,
  setShowInfoModal: bare_setShowInfoModal,
} = reportSlice.actions;
export const {
  setDoAutoSelect, setShowTags, setFilter, setCenterPanelPlaceholderMessage,
  setDisplayEmpty, setFetchError, setFetchErrorMessagePrelude, setFetching,
  setFetchingMessage, setJsonReport, setLoading, setLoadingMessage,
  setSelectedTestCase, setShowHelpModal, setShowInfoModal,
} = wrapActionCreators(reportSlice.actions);
export default reportSlice;
