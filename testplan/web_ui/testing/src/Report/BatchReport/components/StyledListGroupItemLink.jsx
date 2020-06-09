import React from 'react';
import ListGroupItem from 'reactstrap/lib/ListGroupItem';
import { css } from 'aphrodite/es';
import connect from 'react-redux/es/connect/connect';

import StyledNavLink from './StyledNavLink';
import { navUtilsStyles } from '../style';

const connector = connect(
  () => ({
    linkClasses: css(
      navUtilsStyles.navButton,
      navUtilsStyles.navButtonInteract,
    ),
  }),
);

export default connector(({ linkClasses, pathname, dataUid, ...props }) => (
  <ListGroupItem {...props}
                 tag={StyledNavLink}
                 pathname={pathname}
                 dataUid={dataUid}
                 className={linkClasses}
  />
));
