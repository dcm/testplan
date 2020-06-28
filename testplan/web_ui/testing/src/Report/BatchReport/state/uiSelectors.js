import { createSelector } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import _has from 'lodash/has';
import { mkGetReportDocument } from './reportSelectors';
import navStyles from '../../../Toolbar/navStyles';
import { STATUS_CATEGORY } from '../../../Common/defaults';

export const mkGetUIHashAliasToComponent = () => st => {
  return st.ui.hashAliasToComponent;
};
export const getUIHashAliasToComponent = mkGetUIHashAliasToComponent();

export const mkGetUIHashComponentToAlias = () => st => {
  return st.ui.hashComponentToAlias;
};
export const getUIHashComponentToAlias = mkGetUIHashComponentToAlias();

export const mkGetUIIsShowHelpModal = () => st => st.ui.isShowHelpModal;
export const getUIIsShowHelpModal = mkGetUIIsShowHelpModal();

export const mkGetUIIsDisplayEmpty = () => st => st.ui.isDisplayEmpty;
export const getUIIsDisplayEmpty = mkGetUIIsDisplayEmpty();

export const mkGetUIFilter = () => st => st.ui.filter;
export const getUIFilter = mkGetUIFilter();

export const mkGetUIIsShowTags = () => st => st.ui.isShowTags;
export const getUIIsShowTags = mkGetUIIsShowTags();

export const mkGetUIIsShowInfoModal = () => st => st.ui.isShowInfoModal;
export const getUIIsShowInfoModal = mkGetUIIsShowInfoModal();

export const mkGetUISelectedTestCase = () => st => st.ui.selectedTestCase;
export const getUISelectedTestCase = mkGetUISelectedTestCase();

export const mkGetUIDoAutoSelect = () => st => st.ui.doAutoSelect;
export const getUIDoAutoSelect = mkGetUIDoAutoSelect();

export const mkGetUIToolbarStyle = () => createSelector(
  mkGetReportDocument(),
  document => {
    const status = _has(document, 'status') ? document.status : null;
    const category = STATUS_CATEGORY[status];
    if(category) {
      const style = {
        passed: navStyles.toolbarPassed,
        failed: navStyles.toolbarFailed,
        error: navStyles.toolbarFailed,
        unstable: navStyles.toolbarUnstable,
      }[category];
      if(style) {
        return style;
      }
    }
    return navStyles.toolbarUnknown;
  }
);
export const getUIToolbarStyle = mkGetUIToolbarStyle();
