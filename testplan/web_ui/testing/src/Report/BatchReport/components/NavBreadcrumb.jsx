import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { css } from 'aphrodite';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux/es/redux';

import StyledNavLink from './StyledNavLink';
import { CommonStyles, navBreadcrumbStyles } from '../style';
import NavEntry from '../../../Nav/NavEntry';
import { safeGetNumPassedFailedErrored } from '../utils';
import { actionCreators } from '../state';

const connector = connect(
  null,
  dispatch => bindActionCreators({
    setSelectedTestCase: actionCreators.setAppBatchReportSelectedTestCase,
  }, dispatch),
);

export default connector(({ entry, setSelectedTestCase }) => {
  const { name, status, category, counter, uid } = entry;
  // this is the matched Route, not necessarily the current URL
  const { url: matchedPath } = useRouteMatch();
  const [ numPassed, numFailed ] = safeGetNumPassedFailedErrored(counter, 0);
  return (
    <StyledNavLink pathname={matchedPath}
                   dataUid={uid}
                   className={css(
                     navBreadcrumbStyles.breadcrumbEntry,
                     CommonStyles.unselectable,
                   )}
                   onClick={() => setSelectedTestCase(null)}
    >
      <NavEntry name={name}
                status={status}
                type={category}
                caseCountPassed={numPassed}
                caseCountFailed={numFailed}
      />
    </StyledNavLink>
  );
});
