import React from 'react';
import { css } from 'aphrodite/es';
import connect from 'react-redux/es/connect/connect';
import { mkGetIsDevel } from '../../state/appSelectors';
import { mkGetIsTesting } from '../../state/appSelectors';
import { mkGetSkipFetch } from '../../state/appSelectors';
import CenterPane from './components/CenterPane';
import Toolbar from './components/Toolbar';
import UIRouter from './state/UIRouter';
import NavPanes from './components/NavPanes';
import { batchReportStyles } from './style';
import { fetchReport } from './state/reportActions';

const BATCH_REPORT_CLASSES = css(batchReportStyles.batchReport);

const connector = connect(
  () => {
    const getIsDevel = mkGetIsDevel();
    const getIsTesting = mkGetIsTesting();
    const getSkipFetch = mkGetSkipFetch();
    return state => ({
      isDevel: getIsDevel(state),
      isTesting: getIsTesting(state),
      skipFetch: getSkipFetch(state),
    });
  },
  { fetchReport },
  (stateProps, dispatchProps, ownProps) => {
    const { isDevel, isTesting, skipFetch } = stateProps;
    const { match: { params: { id: uid } } } = ownProps;
    const { fetchReport } = dispatchProps;
    return { isDevel, isTesting, fetchReport, uid, skipFetch };
  }
);

export default connector(({ isDevel, isTesting, fetchReport, uid, skipFetch }) => {
  React.useEffect(() => {
    if(!skipFetch) {
      return fetchReport(uid).abort;
    }
  }, [ uid, skipFetch, fetchReport ]);
  return (
    <UIRouter>
      <div className={BATCH_REPORT_CLASSES}>
        <Toolbar/>
        <NavPanes/>
        <CenterPane/>
      </div>
    </UIRouter>
  );
});
