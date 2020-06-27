import React from 'react';
import { css } from 'aphrodite/es';
import { withRouter } from 'react-router';
import connect from 'react-redux/es/connect/connect';

import { mkGetIsDevel } from '../../state/appSelectors';
import { mkGetIsTesting } from '../../state/appSelectors';
import CenterPane from './components/CenterPane';
import Toolbar from './components/Toolbar';
import UIRouter from './state/UIRouter';
import NavPanes from './components/NavPanes';
import { batchReportStyles } from './style';
import runFetch from './state/reportWorker/runFetch';

const connector = connect(
  () => {
    const getIsDevel = mkGetIsDevel();
    const getIsTesting = mkGetIsTesting();
    return state => ({
      isDevel: getIsDevel(state),
      isTesting: getIsTesting(state),
    });
  },
  {
    runFetch,
  },
  (stateProps, dispatchProps, ownProps) => {
    const { isDevel, isTesting } = stateProps;
    const { runFetch } = dispatchProps;
    const { skipFetch, browserProps, location } = ownProps;
    return {
      isDevel,
      isTesting,
      runFetch,
      skipFetch,
      browserProps,
      batchReportClasses: css(batchReportStyles.batchReport),
      location,
    };
  },
);

const BatchReport = connector(withRouter(({
  isDevel, isTesting, skipFetch, browserProps, batchReportClasses, location,
  runFetch,
}) => {
  runFetch(browserProps.match.params.id);
  // const [, [ mapHashQueryToState, mapQueryToState ]] = useReportState(false, [
  //     'mapUriHashQueryToState', 'mapUriQueryToState'
  //   ]);
  // const uriQueryMap = queryStringToMap(
  //   // `browserProps.location` may not exist during tests
  //   browserProps.location ? browserProps.location.search : ''
  // );
  // const uriHashQueryMap = queryStringToMap(location.search);
  // // always sync on first render
  // const isFirstRenderRef = React.useRef(true);
  // if(isFirstRenderRef.current) {
  //   mapHashQueryToState(uriHashQueryMap);
  //   mapQueryToState(uriQueryMap);
  //   isFirstRenderRef.current = false;
  // }
  // // sync query params to state when they change
  // const prevQueryMapRef = React.useRef(uriHashQueryMap);
  // if(!equals(uriQueryMap, prevQueryMapRef.current)) {
  //   mapQueryToState(uriQueryMap);
  //   prevQueryMapRef.current = uriQueryMap;
  // }
  // // sync hash query params to state when they change
  // const prevHashQueryMapRef = React.useRef(uriHashQueryMap);
  // if(!equals(uriHashQueryMap, prevHashQueryMapRef.current)) {
  //   mapHashQueryToState(uriHashQueryMap);
  //   prevHashQueryMapRef.current = uriHashQueryMap;
  // }
  // useFetchReport(
  //   browserProps.match.params.uid,
  //   isDevel || isTesting,
  //   skipFetch,
  // );
  return (
    <div className={batchReportClasses}>
      <Toolbar/>
      <NavPanes/>
      <CenterPane/>
    </div>
  );
}));

const wrapperConnector = connect(
  null,
  null,
  (_, __, ownProps) => {
    const { match, location, history, skipFetch } = ownProps;
    return {
      skipFetch: skipFetch || false,
      browserProps: { match, location, history },
    };
  }
);

export default wrapperConnector(({ skipFetch, browserProps }) => (
  <UIRouter>
    <BatchReport browserProps={browserProps} skipFetch={skipFetch} />
  </UIRouter>
));
