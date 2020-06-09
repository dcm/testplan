import React from 'react';
import { css } from 'aphrodite/es';
import connect from 'react-redux/es/connect/connect';

import { navBreadcrumbStyles } from '../style';

const connector = connect(
  () => ({
    navBreadcrumbClasses: css(navBreadcrumbStyles.navBreadcrumbs),
    breadcrumbContainerClasses: css(navBreadcrumbStyles.breadcrumbContainer),
  }),
  null,
  (stateProps, _, ownProps) => {
    const { navBreadcrumbClasses, breadcrumbContainerClasses } = stateProps;
    const { children } = ownProps;
    return {
      navBreadcrumbClasses,
      breadcrumbContainerClasses,
      children: children || null,
    };
  },
);

export default connector(({
  children, navBreadcrumbClasses, breadcrumbContainerClasses,
}) => (
  <div className={navBreadcrumbClasses}>
    <ul className={breadcrumbContainerClasses}>
      {children}
    </ul>
  </div>
));
