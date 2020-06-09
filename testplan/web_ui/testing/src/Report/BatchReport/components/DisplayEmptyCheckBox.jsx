import React from 'react';
import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import { css } from 'aphrodite/es';
import connect from 'react-redux/es/connect/connect';

import { mkGetUIIsDisplayEmpty } from '../state/uiSelectors';
import { setDisplayEmpty } from '../state/UIRouter';
import navStyles from '../../../Toolbar/navStyles';

const connector = connect(
  () => {
    const getIsDisplayEmpty = mkGetUIIsDisplayEmpty();
    return state => ({
      isDisplayEmpty: getIsDisplayEmpty(state),
      dropdownItemClasses: css(navStyles.dropdownItem),
      filterLabelClasses: css(navStyles.filterLabel),
    });
  },
  {
    setDisplayEmpty,
  },
  (stateProps, dispatchProps, ownProps) => {
    const {
      dropdownItemClasses, filterLabelClasses, isDisplayEmpty
    } = stateProps;
    const { setDisplayEmpty } = dispatchProps;
    const { label } = ownProps;
    return {
      label: label || '',
      dropdownItemClasses,
      filterLabelClasses,
      isDisplayEmpty,
      onChange: () => setDisplayEmpty(!isDisplayEmpty),
    };
  }
);

export default connector(({
  label, isDisplayEmpty, onChange, dropdownItemClasses, filterLabelClasses,
}) => (
  <DropdownItem toggle={false} className={dropdownItemClasses}>
    <Label check className={filterLabelClasses}>
      <Input type='checkbox'
             name='displayEmpty'
             checked={!isDisplayEmpty}
             onChange={onChange}
      />
      {' ' + label}
    </Label>
  </DropdownItem>
));
