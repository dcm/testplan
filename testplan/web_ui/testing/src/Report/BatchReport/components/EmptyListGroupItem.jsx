import React from 'react';
import ListGroupItem from 'reactstrap/lib/ListGroupItem';
import { css } from 'aphrodite/es';
import { navUtilsStyles } from '../style';

const lgiClasses = css(navUtilsStyles.navButton);

export default () => (
  <ListGroupItem className={lgiClasses}>
    No entries to display...
  </ListGroupItem>
);
