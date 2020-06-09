import React from 'react';
import ListGroupItem from 'reactstrap/lib/ListGroupItem';
import { css } from 'aphrodite/es';
import connect from 'react-redux/es/connect/connect';

import { navUtilsStyles } from '../style';

const connector = connect(
  () => ({
    lgiClasses: css(navUtilsStyles.navButton),
  }),
);

export default connector(({ lgiClasses }) => (
  <ListGroupItem className={lgiClasses}>
    No entries to display...
  </ListGroupItem>
));
