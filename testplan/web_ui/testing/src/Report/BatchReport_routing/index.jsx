import React from 'react';
import _isEqual from 'lodash/isEqual';
import { css } from 'aphrodite';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import CenterPane from './components/CenterPane';
import Toolbar from './components/Toolbar';
import { batchReportStyles } from './style';
import ReportStateProvider from './state/ReportStateProvider';
import useReportState from './hooks/useReportState';
import useFetchReport from './hooks/useFetchReport';
import UIRouter from './components/UIRouter';
import NavPanes from './components/NavPanes';
import { queryStringToMap } from '../../Common/utils';

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
  if(!_isEqual(uriQueryMap, prevQueryMapRef.current)) {
    mapQueryToState(uriQueryMap);
    prevQueryMapRef.current = uriQueryMap;
  }

  // sync hash query params to state when they change
  const prevHashQueryMapRef = React.useRef(uriHashQueryMap);
  if(!_isEqual(uriHashQueryMap, prevHashQueryMapRef.current)) {
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

export default function BatchReport(props) {
  const { match, location, history, skipFetch,  } = props;
  const browserProps = { match, location, history };
  const className = css(batchReportStyles.batchReport);
  return React.useMemo(() => (
    <ReportStateProvider>
      <UIRouter>
        <BatchReportStartup browserProps={browserProps} skipFetch={skipFetch}>
          <div className={className}>
            <Toolbar/>
            <NavPanes/>
            <CenterPane/>
          </div>
        </BatchReportStartup>
      </UIRouter>
    </ReportStateProvider>
  ), [ browserProps, skipFetch, className ]);
}
