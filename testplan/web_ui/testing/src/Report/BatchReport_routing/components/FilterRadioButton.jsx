import React from 'react';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import { css } from 'aphrodite';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux/es/redux';

import navStyles from '../../../Toolbar/navStyles';
import { actionTypes, actionCreators } from '../state';

const { APP_BATCHREPORT_FILTER } = actionTypes;
const connector = connect(
  state => ({
    filter: state[APP_BATCHREPORT_FILTER],
  }),
  dispatch => bindActionCreators({
    setFilter: actionCreators.setAppBatchReportFilter,
  }, dispatch),
);

/**
 * Buttons used to set the filters. The placeholders "<none>" are meant to alert
 * the user / developer to an omission that should be fixed.
 * @param {Object} obj
 * @param {string} [obj.value="<none>"]
 * @param {string} [obj.label="<none>"]
 * @returns {React.FunctionComponentElement}
 */
export default connector(
  ({ filter, setFilter, value = '<none>', label = '<none>' }) => {
    return (
      <DropdownItem toggle={false} className={css(navStyles.dropdownItem)}>
        <Label check className={css(navStyles.filterLabel)}>
          <Input type='radio'
                 name='filter'
                 value={value}
                 checked={filter === value}
                 onChange={evt => setFilter(evt.currentTarget.value)}
          />
          {' ' + label}
        </Label>
      </DropdownItem>
    );
  }
);
