import 
  createSearchParamSetterThunk
from '../../../../state/utils-detat/history/createSearchParamSetterThunk';
import uiHistory from './';

export const setShowTags =
  createSearchParamSetterThunk({
    actionType: 'SET_SHOW_TAGS',
    history: uiHistory,
    param: 'showTags',
    transformer: val => !!val,
  });

export const setShowInfoModal =
  createSearchParamSetterThunk({
    actionType: 'SET_SHOW_INFO_MODAL',
    history: uiHistory,
    param: 'showInfoModal',
    transformer: val => !!val,
  });

export const setDoAutoSelect =
  createSearchParamSetterThunk({
    actionType: 'SET_DO_AUTO_SELECT',
    history: uiHistory,
    param: 'doAutoSelect',
    transformer: val => !!val,
  });

export const setFilter =
  createSearchParamSetterThunk({
    actionType: 'SET_FILTER',
    history: uiHistory,
    param: 'filter',
    transformer: val => String(val),
  });

export const setDisplayEmpty =
  createSearchParamSetterThunk({
    actionType: 'SET_DISPLAY_EMPTY',
    history: uiHistory,
    param: 'displayEmpty',
    transformer: val => !!val,
  });

export const setShowHelpModal =
  createSearchParamSetterThunk({
    actionType: 'SET_SHOW_HELP_MODAL',
    history: uiHistory,
    param: 'showHelpModal',
    transformer: val => !!val,
  });
