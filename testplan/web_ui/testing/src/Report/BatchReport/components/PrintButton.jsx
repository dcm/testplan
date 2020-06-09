import React from 'react';
import NavItem from 'reactstrap/lib/NavItem';
import { css } from 'aphrodite/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome/index.es';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import connect from 'react-redux/es/connect/connect';

import navStyles from '../../../Toolbar/navStyles';

library.add(faPrint);

const connector = connect(
  () => ({
    buttonsBarClasses: css(navStyles.buttonsBar),
    toolbarButtonClasses: css(navStyles.toolbarButton),
    printIconName: faPrint.iconName,
  }),
);

export default connector(({
  buttonsBarClasses, toolbarButtonClasses, printIconName
}) => (
  <NavItem>
    <div className={buttonsBarClasses}>
      <span onClick={window.print}>
        <FontAwesomeIcon key='toolbar-print'
                         className={toolbarButtonClasses}
                         icon={printIconName}
                         title='Print page'
        />
      </span>
    </div>
  </NavItem>
));
