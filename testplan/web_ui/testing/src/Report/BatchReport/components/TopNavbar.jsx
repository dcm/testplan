import React from 'react';
import { css } from 'aphrodite';
import Navbar from 'reactstrap/lib/Navbar';
import Nav from 'reactstrap/lib/Nav';
import Collapse from 'reactstrap/lib/Collapse';
import connect from 'react-redux/es/connect/connect';

import navStyles from '../../../Toolbar/navStyles';
import FilterBox from '../../../Toolbar/FilterBox';
import InfoButton from './InfoButton';
import FilterButton from './FilterButton';
import PrintButton from './PrintButton';
import TagsButton from './TagsButton';
import HelpButton from './HelpButton';
import DocumentationButton from './DocumentationButton';
import getToolbarStyle from '../utils/getToolbarStyle';
import { actionTypes } from '../state';

const { APP_BATCHREPORT_JSON_REPORT } = actionTypes;
const connector = connect(
  state => ({
    jsonReport: state[APP_BATCHREPORT_JSON_REPORT],
  }),
);

/**
 * Return the navbar including all buttons.
 * @param {React.PropsWithChildren<object>} props
 * @returns {React.FunctionComponentElement}
 */
export default connector(({ jsonReport, children = null }) => {
  const jsonReportStatus = jsonReport && jsonReport.status;
  const toolbarStyle = React.useMemo(() => (
    getToolbarStyle(jsonReportStatus)
  ), [ jsonReportStatus ]);
  return React.useMemo(() => (
    <Navbar light expand='md' className={css(navStyles.toolbar)}>
      <div className={css(navStyles.filterBox)}>
        <FilterBox/>
      </div>
      <Collapse navbar className={toolbarStyle}>
        <Nav navbar className='ml-auto'>
          {children}
          <InfoButton/>
          <FilterButton toolbarStyle={toolbarStyle}/>
          <PrintButton/>
          <TagsButton/>
          <HelpButton/>
          <DocumentationButton/>
        </Nav>
      </Collapse>
    </Navbar>
  ), [ toolbarStyle, children ]);
});
