import React from 'react';
import connect from 'react-redux/es/connect/connect';
import { NavLink } from 'react-router-dom';
import { css } from 'aphrodite/es';

import { getUIRouterSearch } from '../state/uiSelectors';
import { mkGetUISelectedTestCase } from '../state/uiSelectors';
import { navUtilsStyles } from '../style';

const connector = connect(
  () => {
    const getSelectedTestCase = mkGetUISelectedTestCase();
    return state => ({
      selectedTestCase: getSelectedTestCase(state),
      uiRouterSearch: getUIRouterSearch(state),
    });
  },
  null,
  (stateProps, _, ownProps) => {
    const { selectedTestCase, uiRouterSearch } = stateProps;
    const { pathname, dataUid, style, ...props } = ownProps;
    return {
      style: style && typeof style === 'object' ? style : {
        textDecoration: 'none',
        color: 'currentColor',
      },
      linkedLocation: {
        search: uiRouterSearch,
        pathname: pathname.replace(/\/{2,}/g, '/'),
      },
      isActive: () => (
        selectedTestCase &&
        (typeof selectedTestCase === 'object') &&
        selectedTestCase.uid === dataUid
      ),
      navButtonClasses: css(navUtilsStyles.navButtonInteract),
      ...props,
    };
  },
);

export default connector(({
  style, linkedLocation, isActive, dataUid, navButtonClasses, ...props
}) => (
  <NavLink style={style}
           data-uid={dataUid}
           isActive={isActive}
           activeClassName={navButtonClasses}
           to={linkedLocation}
           {...props}
  />
));
