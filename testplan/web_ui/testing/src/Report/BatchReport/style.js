import { StyleSheet } from 'aphrodite/es';

export { default as CommonStyles } from '../../Common/Styles';
export { styles as navBreadcrumbStyles } from '../../Nav/NavBreadcrumbs';
export { styles as navUtilsStyles } from '../../Nav/navUtils';
export { COLUMN_WIDTH } from '../../Common/defaults';

export const navListStyles = StyleSheet.create({
  buttonList: {
    'overflow-y': 'auto',
    'height': '100%',
  }
});

export const batchReportStyles = StyleSheet.create({
  batchReport: {
    /** overflow will hide dropdown div */
    // overflow: 'hidden'
  }
});
