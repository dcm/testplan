import React from 'react';
import { Route } from 'react-router';
import connect from 'react-redux/es/connect/connect';

import { mkGetReportIsFetching } from '../state/reportSelectors';
import { mkGetReportLastFetchError } from '../state/reportSelectors';
import { mkGetReportDocument } from '../state/reportSelectors';
import EmptyListGroupItem from './EmptyListGroupItem';
import NavBreadcrumbContainer from './NavBreadcrumbContainer';
import NavBreadcrumbWithNextRoute from './NavBreadcrumbWithNextRoute';
import NavSidebarWithNextRoute from './NavSidebarWithNextRoute';
import AutoSelectRedirect from './AutoSelectRedirect';

const connector = connect(
  () => {
    const getReportIsFetching = mkGetReportIsFetching();
    const getReportLastFetchError = mkGetReportLastFetchError();
    const getReportDocument = mkGetReportDocument();
    return state => {
      const document = getReportDocument(state);
      return {
        document,
        documentEntries: [ document ],
        lastFetchError: getReportLastFetchError(state),
        isFetching: getReportIsFetching(state),
      };
    };
  },
);

export default connector(({
  document, documentEntries, fetchError, isFetching
}) => (isFetching || fetchError || !document) ? <EmptyListGroupItem/> : (
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
        <NavBreadcrumbWithNextRoute entries={documentEntries}/>
      )}/>
    </NavBreadcrumbContainer>
    {
      /**
       * Here each path component completely replaces the nav sidebar.
       * This contains the links that will determine the next set of routes.
       */
    }
    <Route path='/:id' render={() =>
      <NavSidebarWithNextRoute entries={documentEntries}/>
    }/>
    <Route exact path='/' component={() =>
      <AutoSelectRedirect basePath='/' entry={document}/>
    }/>
  </>
));
