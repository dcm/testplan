import React from 'react';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import { css } from 'aphrodite/es';
import connect from 'react-redux/es/connect/connect';

import { mkGetUIFilter } from '../state/uiSelectors';
import { setFilter } from '../state/uiActions';
import navStyles from '../../../Toolbar/navStyles';

const connector = connect(
  () => {
    const getFilter = mkGetUIFilter();
    return state => ({
      filter: getFilter(state),
      dropdownItemClasses: css(navStyles.dropdownItem),
      filterLabelClasses: css(navStyles.filterLabel),
    });
  },
  {
    setFilter
  },
  (stateProps, dispatchProps, ownProps) => {
    const { filter, dropdownItemClasses, filterLabelClasses } = stateProps;
    const { setFilter } = dispatchProps;
    const { value, label } = ownProps;
    return {
      isChecked: filter === value,
      onChange: evt => setFilter(evt.currentTarget.value),
      value: value || '<none>',
      label: label || '<none>',
      dropdownItemClasses,
      filterLabelClasses,
    };
  },
);

export default connector(({
  isChecked, onChange, value, label, dropdownItemClasses, filterLabelClasses,
}) => (
  <DropdownItem toggle={false} className={dropdownItemClasses}>
    <Label check className={filterLabelClasses}>
      <Input type='radio'
             name='filter'
             value={value}
             checked={isChecked}
             onChange={onChange}
      />
      {' ' + label}
    </Label>
  </DropdownItem>
));
