import React from 'react';
import NavItem from 'reactstrap/lib/NavItem';
import { css } from 'aphrodite/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome/index.es';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTags } from '@fortawesome/free-solid-svg-icons';
import connect from 'react-redux/es/connect/connect';

import { mkGetUIIsShowTags } from '../state/uiSelectors';
import { setShowTags } from '../state/uiActions';
import navStyles from '../../../Toolbar/navStyles';

library.add(faTags);

const connector = connect(
  () => {
    const getIsShowTags = mkGetUIIsShowTags();
    return state => ({
      isShowTags: getIsShowTags(state),
    });
  },
  {
    setShowTags,
  },
  (stateProps, dispatchProps) => {
    const { isShowTags } = stateProps;
    const { setShowTags } = dispatchProps;
    return {
      buttonsBarClasses: css(navStyles.buttonsBar),
      toolbarButtonClasses: css(navStyles.toolbarButton),
      tagsIconName: faTags.iconName,
      onClick: evt => {
        evt.stopPropagation();
        setShowTags(!isShowTags);
      },
    };
  },
);

export default connector(({
  onClick, buttonsBarClasses, toolbarButtonClasses, tagsIconName
}) => (
  <NavItem>
    <div className={buttonsBarClasses}>
      <span onClick={onClick}>
        <FontAwesomeIcon key='toolbar-tags'
                         className={toolbarButtonClasses}
                         icon={tagsIconName}
                         title='Toggle tags'
        />
      </span>
    </div>
  </NavItem>
));
