import React from 'react';
import NavItem from 'reactstrap/lib/NavItem';
import { css } from 'aphrodite/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome/index.es';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import connect from 'react-redux/es/connect/connect';
import { mkGetUIIsShowInfoModal } from '../state/uiSelectors';
import { setShowInfoModal } from '../state/uiActions';
import navStyles from '../../../Toolbar/navStyles';

library.add(faInfo);

const connector = connect(
  () => {
    const getIsShowInfoModal = mkGetUIIsShowInfoModal();
    return state => ({
      isShowInfoModal: getIsShowInfoModal(state),
      toolbarIconName: faInfo.iconName,
      toolbarIconClasses: css(navStyles.toolbarButton),
      buttonsBarClasses: css(navStyles.buttonsBar),
    });
  },
  {
    setShowInfoModal,
  },
  (stateProps, dispatchProps) => {
    const {
      isShowInfoModal, toolbarIconName, toolbarIconClasses, buttonsBarClasses
    } = stateProps;
    const { setShowInfoModal } = dispatchProps;
    return {
      buttonsBarClasses,
      toolbarIconClasses,
      toolbarIconName,
      toggleInfo: evt => {
        evt.stopPropagation();
        setShowInfoModal(!isShowInfoModal);
      },
    };
  },
);

export default connector(({
  buttonsBarClasses, toolbarIconClasses, toolbarIconName, toggleInfo
}) => (
  <NavItem>
    <div className={buttonsBarClasses}>
      <span onClick={toggleInfo}>
        <FontAwesomeIcon key='toolbar-info'
                         className={toolbarIconClasses}
                         icon={toolbarIconName}
                         title='Info'
        />
      </span>
    </div>
  </NavItem>
));
