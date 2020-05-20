import React from 'react';
import NavItem from 'reactstrap/lib/NavItem';
import { css } from 'aphrodite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux/es/redux';

import navStyles from '../../../Toolbar/navStyles';
import { actionTypes, actionCreators } from '../state';

library.add(faInfo);

const { APP_BATCHREPORT_SHOW_INFO_MODAL } = actionTypes;
const connector = connect(
  state => ({
    isShowInfoModal: state[APP_BATCHREPORT_SHOW_INFO_MODAL],
  }),
  dispatch => bindActionCreators({
    setShowInfoModal: actionCreators.setAppBatchReportShowInfoModal,
  }, dispatch),
);

/**
 * Return the info button which toggles the info modal.
 * @returns {React.FunctionComponentElement}
 */
export default connector(({ isShowInfoModal, setShowInfoModal }) => {
  const onClick = evt => {
    evt.stopPropagation();
    setShowInfoModal(!isShowInfoModal);
  };
  return (
    <NavItem>
      <div className={css(navStyles.buttonsBar)}>
        <span onClick={onClick}>
          <FontAwesomeIcon key='toolbar-info'
                           className={css(navStyles.toolbarButton)}
                           icon={faInfo.iconName}
                           title='Info'
          />
        </span>
      </div>
    </NavItem>
  );
});
