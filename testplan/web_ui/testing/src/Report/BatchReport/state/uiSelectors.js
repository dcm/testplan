import { createSelector } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { mkGetReportDocumentStatus } from './reportSelectors';
import navStyles from '../../../Toolbar/navStyles';
import { STATUS_CATEGORY } from '../../../Common/defaults';

export const mkGetUIHashAliasToComponent = () => st => st.hashAliasToComponent;

export const mkGetUIHashComponentToAlias = () => st => st.hashComponentToAlias;

export const mkGetUIIsShowHelpModal = () => st => st.isShowHelpModal;

export const mkGetUIIsDisplayEmpty = () => st => st.isDisplayEmpty;

export const mkGetUIFilter = () => st => st.filter;

export const mkGetUIIsShowTags = () => st => st.isShowTags;

export const mkGetUIIsShowInfoModal = () => st => st.isShowInfoModal;

export const mkGetUISelectedTestCase = () => st => st.selectedTestCase;

export const mkGetUIDoAutoSelect = () => st => st.doAutoSelect;

export const mkGetUIToolbarStyle = () => createSelector(
  mkGetReportDocumentStatus(),
  status => {
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
