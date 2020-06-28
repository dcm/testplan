import React from 'react';
import { withRouter } from 'react-router';
import { css } from 'aphrodite/es';
import connect from 'react-redux/es/connect/connect';
import { setSelectedTestCase } from '../state/uiActions';
import StyledNavLink from './StyledNavLink';
import { CommonStyles, navBreadcrumbStyles } from '../style';
import NavEntry from '../../../Nav/NavEntry';
import { safeGetNumPassedFailedErrored } from '../utils';

const connector = connect(
  () => ({
    linkClasses: css(
      navBreadcrumbStyles.breadcrumbEntry,
      CommonStyles.unselectable,
    ),
  }),
  {
    setSelectedTestCase,
  },
  (stateProps, dispatchProps, ownProps) => {
    const { linkClasses } = stateProps;
    const { setSelectedTestCase } = dispatchProps;
    // `matchedUrl` is the matched Route, not necessarily the current URL
    const {
      entry: {
        name: entryName,
        status: entryStatus,
        category: entryCategory,
        counter: entryCounter,
        uid: entryUid,
      },
      match: {
        url: matchedUrl,
      },
    } = ownProps;
    const [
      numPassed,
      numFailed
    ] = safeGetNumPassedFailedErrored(entryCounter, 0);
    return {
      linkClasses,
      entryName,
      entryStatus,
      entryCategory,
      entryUid,
      numPassed,
      numFailed,
      matchedUrl,
      onClick: () => setSelectedTestCase(null),
    };
  }
);

export default connector(withRouter(({
  linkClasses, entryName, entryStatus, entryCategory, entryUid,
  numPassed, numFailed, matchedUrl, onClick,
}) => (
  <StyledNavLink pathname={matchedUrl}
                 dataUid={entryUid}
                 className={linkClasses}
                 onClick={onClick}
  >
    <NavEntry name={entryName}
              status={entryStatus}
              type={entryCategory}
              caseCountPassed={numPassed}
              caseCountFailed={numFailed}
    />
  </StyledNavLink>
)));
