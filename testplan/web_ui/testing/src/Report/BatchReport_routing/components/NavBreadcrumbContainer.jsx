import React from 'react';
import { css } from 'aphrodite/es';
import { navBreadcrumbStyles } from '../style';

export default ({ children = null }) => (
  <div className={css(navBreadcrumbStyles.navBreadcrumbs)}>
    <ul className={css(navBreadcrumbStyles.breadcrumbContainer)}>
      {children}
    </ul>
  </div>
);
