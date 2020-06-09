import React from 'react';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { css } from 'aphrodite/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome/index.es';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import connect from 'react-redux/es/connect/connect';

import navStyles from '../../../Toolbar/navStyles';
import FilterRadioButton from './FilterRadioButton';
import DisplayEmptyCheckBox from './DisplayEmptyCheckBox';
import * as filterStates from '../utils/filterStates';

library.add(faFilter);

const connector = connect(
  () => ({
    buttonsBarClasses: css(navStyles.buttonsBar),
    filterIconName: faFilter.iconName,
    dropdownButtonClasses: css(navStyles.toolbarButton),
    filterDropdownClasses: css(navStyles.filterDropdown),
    filter_ALL: filterStates.ALL,
    filter_FAILED: filterStates.FAILED,
    filter_PASSED: filterStates.PASSED,
  }),
);

export default connector(({
  toolbarStyle, buttonsBarClasses, filterIconName, dropdownButtonClasses,
  filterDropdownClasses, filter_ALL, filter_PASSED, filter_FAILED
}) => (
  <UncontrolledDropdown nav inNavbar>
    <div className={buttonsBarClasses}>
      <DropdownToggle nav className={toolbarStyle}>
        <FontAwesomeIcon key='toolbar-filter'
                         icon={filterIconName}
                         title='Choose filter'
                         className={dropdownButtonClasses}
        />
      </DropdownToggle>
    </div>
    <DropdownMenu className={filterDropdownClasses}>
      <FilterRadioButton value={filter_ALL} label='All'/>
      <FilterRadioButton value={filter_FAILED} label='Failed only'/>
      <FilterRadioButton value={filter_PASSED} label='Passed only'/>
      <DropdownItem divider/>
      <DisplayEmptyCheckBox label='Hide empty testcase'/>
    </DropdownMenu>
  </UncontrolledDropdown>
));
