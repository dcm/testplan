import React from 'react';
import equals from 'ramda/es/equals';
import { css } from 'aphrodite/es';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types/index';
import { CenterPane } from './components';
import { Toolbar } from './components';
import { UIRouter } from './components';
import { NavPanes } from './components';
import { batchReportStyles } from './style';
import { ReportStateProvider } from './state';
import useReportState from './hooks/useReportState';
import useFetchReport from './hooks/useFetchReport';
import { queryStringToMap } from '../../Common/utils';
import AppStateProvider from './state/react-redux/UIStateProvider';

// import {
//   OtherConnectedRouter, OtherProvider, otherConnect,
// } from './state/react-redux/store';
import { push } from 'connected-react-router/esm/actions';
import connect from 'react-redux/es/connect/connect';

export function BatchReportStartup({
  browserProps, children, skipFetch = false
}) {
  const
    currLocation = useLocation(),
    [, [ mapHashQueryToState, mapQueryToState ]] = useReportState(false, [
      'mapUriHashQueryToState', 'mapUriQueryToState'
    ]),
    uriQueryMap = queryStringToMap(
      // `browserProps.location` may not exist during tests
      browserProps.location ? browserProps.location.search : ''
    ),
    uriHashQueryMap = queryStringToMap(currLocation.search),
    isDevelopment =
      process.env.NODE_ENV === 'development' && !!uriQueryMap.dev,
    isTesting =
      process.env.NODE_ENV === 'test' && !!uriQueryMap.isTesting;

  // always sync on first render
  const isFirstRenderRef = React.useRef(true);
  if(isFirstRenderRef.current) {
    mapHashQueryToState(uriHashQueryMap);
    mapQueryToState(uriQueryMap);
    isFirstRenderRef.current = false;
  }

  // sync query params to state when they change
  const prevQueryMapRef = React.useRef(uriHashQueryMap);
  if(!equals(uriQueryMap, prevQueryMapRef.current)) {
    mapQueryToState(uriQueryMap);
    prevQueryMapRef.current = uriQueryMap;
  }

  // sync hash query params to state when they change
  const prevHashQueryMapRef = React.useRef(uriHashQueryMap);
  if(!equals(uriHashQueryMap, prevHashQueryMapRef.current)) {
    mapHashQueryToState(uriHashQueryMap);
    prevHashQueryMapRef.current = uriHashQueryMap;
  }

  useFetchReport(
    browserProps.match.params.uid,
    isDevelopment || isTesting,
    skipFetch,
  );

  return children;
}
BatchReportStartup.propTypes = {
  browserProps: PropTypes.shape({
    match: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
  }).isRequired,
  children: PropTypes.element.isRequired,
};

/*export default*/ function BatchReport(props) {
  const { match, location, history, skipFetch,  } = props;
  const browserProps = { match, location, history };
  const className = css(batchReportStyles.batchReport);
  return /*React.useMemo(() =>*/ (
    <AppStateProvider>
     {/*<ReportStateProvider>*/}
     {/*  <UIRouter>*/}
        <p>All components disabled - uncomment once things work.</p>
  {/*<BatchReportStartup browserProps={browserProps} skipFetch={skipFetch}>*/}
        {/*  <div className={className}>*/}
        {/*    <Toolbar/>*/}
        {/*    <NavPanes/>*/}
        {/*    <CenterPane/>*/}
        {/*  </div>*/}
        {/*</BatchReportStartup>*/}
       {/*</UIRouter>*/}
     {/*</ReportStateProvider>*/}
  </AppStateProvider>
  )/*, [ browserProps, skipFetch, className ])*/;
}

// let doPush = true;
// const DummyNavigate = otherConnect(null, { push })(props => {
//   if(doPush) {
//     props.push('/a/b/c');
//     doPush = false;
//   }
//   return null;
// });
//
// export default function ParentBatchReport(props) {
//   return (
//     <OtherProvider>
//       <OtherConnectedRouter>
//         <DummyNavigate/>
//         <BatchReport {...props} />
//       </OtherConnectedRouter>
//     </OtherProvider>
//   );
// }
export default () => (
  <p>ALLALL components disabled - uncomment once things work.</p>
);
