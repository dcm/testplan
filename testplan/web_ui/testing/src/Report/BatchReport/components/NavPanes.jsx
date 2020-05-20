import React from 'react';
import { Route } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';

import EmptyListGroupItem from './EmptyListGroupItem';
import NavBreadcrumbContainer from './NavBreadcrumbContainer';
import NavBreadcrumbWithNextRoute from './NavBreadcrumbWithNextRoute';
import NavSidebarWithNextRoute from './NavSidebarWithNextRoute';
import AutoSelectRedirect from './AutoSelectRedirect';


import { actionTypes } from '../state';

const {
  APP_BATCHREPORT_JSON_REPORT,
  APP_BATCHREPORT_FETCH_ERROR,
  APP_BATCHREPORT_FETCHING,
} = actionTypes;
const connector = connect(
  state => ({
    jsonReport: state[APP_BATCHREPORT_JSON_REPORT],
    fetchError: state[APP_BATCHREPORT_FETCH_ERROR],
    isFetching: state[APP_BATCHREPORT_FETCHING],
  }),
);

export default connector(({ jsonReport, fetchError, isFetching }) => {
  return (isFetching || fetchError || !jsonReport)
    ? <EmptyListGroupItem/>
    : (
      <>
        {
          /**
           * Here each path component adds a new breadcrumb to the top nav,
           * and it sets up the next route that will receive the next path
           * component when the user navigates further
           */
        }
        <NavBreadcrumbContainer>
          <Route path='/:id' render={() => (
            <NavBreadcrumbWithNextRoute entries={[ jsonReport ]}/>
          )}/>
        </NavBreadcrumbContainer>
        {
          /**
           * Here each path component completely replaces the nav sidebar.
           * This contains the links that will determine the next set of routes.
           */
        }
        <Route path='/:id' render={() =>
          <NavSidebarWithNextRoute entries={[ jsonReport ]}/>
        }/>
        <Route exact path='/' component={() =>
          <AutoSelectRedirect basePath='/' entry={jsonReport}/>
        }/>
      </>
    );
});
