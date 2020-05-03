import React from 'react';
import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import { css } from 'aphrodite';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux/es/redux';
import { actionTypes, actionCreators } from '../state';
import navStyles from '../../../Toolbar/navStyles';

const { APP_BATCHREPORT_DISPLAY_EMPTY } = actionTypes;
const connector = connect(
  state => ({
    isDisplayEmpty: state[APP_BATCHREPORT_DISPLAY_EMPTY],
  }),
  dispatch => bindActionCreators({
    setDisplayEmpty: actionCreators.setAppBatchReportIsDisplayEmpty,
  }, dispatch),
);

/**
 * Checkbox that determines whether empty testcases are shown
 * @param {React.PropsWithoutRef<{label: string}>} props
 * @returns {React.FunctionComponentElement}
 */
export default connector(({ label = '', isDisplayEmpty, setDisplayEmpty }) => {
  return (
    <DropdownItem toggle={false} className={css(navStyles.dropdownItem)}>
      <Label check className={css(navStyles.filterLabel)}>
        <Input type='checkbox'
               name='displayEmpty'
               checked={!isDisplayEmpty}
               onChange={() => setDisplayEmpty(!isDisplayEmpty)}
        />
        {' ' + label}
      </Label>
    </DropdownItem>
  );
});
