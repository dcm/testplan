import React from 'react';
import { createAction } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { createHashHistory } from 'history';
import * as filterStates from '../utils/filterStates';
import ErrorCatch from '../../../Common/ErrorCatch';
import {
  createRouterComponents
} from '../../../state/utils-detat/createRouterComponents';

export const uiHistory = createHashHistory({ basename: '/' });

export const setShowTags = createAction(
  'ui/SET_SHOW_TAGS',
  (showTags = false) => ({ payload: !!showTags }),
);

export const setShowInfoModal = createAction(
  'ui/SET_SHOW_INFO_MODAL',
  (showInfoModal = false) => ({ payload: !!showInfoModal }),
);

export const setDoAutoSelect = createAction(
  'ui/SET_DO_AUTO_SELECT',
  (doAutoSelect = true) => ({ payload: !!doAutoSelect }),
);

export const setFilter = createAction(
  'ui/SET_FILTER',
  (filter = filterStates.ALL) => {
    if(!(filter in Object.values(filterStates))) filter = filterStates.ALL;
    return { payload: `${filter}` };
  },
);

export const setDisplayEmpty = createAction(
  'ui/SET_DISPLAY_EMPTY',
  (displayEmpty = true) => ({ payload: !!displayEmpty }),
);

export const setShowHelpModal = createAction(
  'ui/SET_SHOW_HELP_MODAL',
  (showHelpModal = false) => ({ payload: !!showHelpModal }),
);

const uiRouterComponents = createRouterComponents(
  uiHistory,
  ['ui', 'router'],
  {
    showTags: setShowTags,
    showInfoModal: setShowInfoModal,
    doAutoSelect: setDoAutoSelect,
    filter: setFilter,
    displayEmpty: setDisplayEmpty,
    showHelpModal: setShowHelpModal,
  }
);

export const uiRouterActions = uiRouterComponents.actions;
export const uiRouterSelectors = uiRouterComponents.selectors;
export const uiRouterReducer = uiRouterComponents.reducer;
const UIRouterBase = uiRouterComponents.Router;

export default function UIRouter({ children }) {
  return (
    <ErrorCatch level='UIRouter'>
      <UIRouterBase>
        {children}
      </UIRouterBase>
    </ErrorCatch>
  );
}
