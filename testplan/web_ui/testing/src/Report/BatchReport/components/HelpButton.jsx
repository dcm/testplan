import React from 'react';
import NavItem from 'reactstrap/lib/NavItem';
import { css } from 'aphrodite/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome/index.es';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import connect from 'react-redux/es/connect/connect';

import { mkGetUIIsShowHelpModal } from '../state/uiSelectors';
import { setShowHelpModal } from '../state/UIRouter';
import navStyles from '../../../Toolbar/navStyles';

library.add(faQuestionCircle);

const connector = connect(
  () => {
    const getIsShowHelpModal = mkGetUIIsShowHelpModal();
    return state => ({
      isShowHelpModal: getIsShowHelpModal(state),
      toolbarButtonClasses: css(navStyles.toolbarButton),
      toolbarIconName: faQuestionCircle.iconName,
      buttonsBarClasses: css(navStyles.buttonsBar),
    });
  },
  {
    setShowHelpModal,
  },
  (stateProps, dispatchProps) => {
    const {
      isShowHelpModal,
      toolbarButtonClasses,
      toolbarIconName,
      buttonsBarClasses,
    } = stateProps;
    const { setShowHelpModal } = dispatchProps;
    return {
      toolbarButtonClasses,
      buttonsBarClasses,
      toolbarIconName,
      onClick: evt => {
        evt.stopPropagation();
        setShowHelpModal(!isShowHelpModal);
      },
    };
  },
);

/**
 * Return the button which toggles the help modal.
 * @returns {React.FunctionComponentElement}
 */
export default connector(({
  toolbarButtonClasses, buttonsBarClasses, toolbarIconName, onClick
}) => (
  <NavItem>
    <div className={buttonsBarClasses}>
      <span onClick={onClick}>
        <FontAwesomeIcon key='toolbar-question'
                         className={toolbarButtonClasses}
                         icon={toolbarIconName}
                         title='Help'
        />
      </span>
    </div>
  </NavItem>
));
