import React from 'react';
import { css } from 'aphrodite/es';
import Navbar from 'reactstrap/lib/Navbar';
import Nav from 'reactstrap/lib/Nav';
import Collapse from 'reactstrap/lib/Collapse';
import connect from 'react-redux/es/connect/connect';

import { mkGetUIToolbarStyle } from '../state/uiSelectors';
import navStyles from '../../../Toolbar/navStyles';
import FilterBox from '../../../Toolbar/FilterBox';
import InfoButton from './InfoButton';
import FilterButton from './FilterButton';
import PrintButton from './PrintButton';
import TagsButton from './TagsButton';
import HelpButton from './HelpButton';
import DocumentationButton from './DocumentationButton';

const connector = connect(
  () => {
    const getToolbarStyle = mkGetUIToolbarStyle();
    return state => ({
      toolbarStyle: getToolbarStyle(state),
      toolbarClasses: css(navStyles.toolbar),
      filterBoxClasses: css(navStyles.filterBox),
    });
  }
);

export default connector(({
  toolbarStyle, toolbarClasses, filterBoxClasses, children = null
}) => (
  <Navbar light expand='md' className={toolbarClasses}>
    <div className={filterBoxClasses}>
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
));
