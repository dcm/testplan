import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { actionTypes } from '../state';
import { NavLink, useLocation } from 'react-router-dom';
import { css } from 'aphrodite';
import { navUtilsStyles } from '../style';

const { APP_BATCHREPORT_SELECTED_TEST_CASE } = actionTypes;
const connector = connect(
  state => ({
    selectedTestCase: state[APP_BATCHREPORT_SELECTED_TEST_CASE],
  })
);

const StyledNavLink = connector(({
  style = { textDecoration: 'none', color: 'currentColor' },
  isActive = () => false,  // this just makes it look better by default
  pathname, dataUid, selectedTestCase, ...props
}) => {
  // ensure links always include the current query params
  const { search } = useLocation();
  // remove repeating slashes
  const normPathname = pathname.replace(/\/{2,}/g, '/');
  const to = { search, pathname: normPathname };
  return (
    <NavLink style={style}
             data-uid={dataUid}
             isActive={() =>
               !!selectedTestCase &&
               !!(selectedTestCase.uid) &&
               selectedTestCase.uid === dataUid
             }
             activeClassName={css(navUtilsStyles.navButtonInteract)}
             to={to}
             {...props}
    />
  );
});
StyledNavLink.propTypes = {
  pathname: PropTypes.string.isRequired,
  dataUid: PropTypes.string.isRequired,
  style: PropTypes.object,
  isActive: PropTypes.func,
};

export default StyledNavLink;
