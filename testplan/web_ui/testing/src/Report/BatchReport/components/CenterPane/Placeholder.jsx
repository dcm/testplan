import React from 'react';
import { mkGetReportDownloadProgress } from '../../state/reportSelectors';
import { mkGetReportFetchStage } from '../../state/reportSelectors';
import { mkGetReportLastFetchError } from '../../state/reportSelectors';
import Progress from 'reactstrap/lib/Progress';
import connect from 'react-redux/es/connect/connect';
import _debounce from 'lodash/debounce';

import * as Signals from '../../state/reportWorker/signals';
import Message from '../../../../Common/Message';
import { humanReadableSize } from '../../../../Common/utils';
import { COLUMN_WIDTH } from '../../../../Common/defaults';

const STARTING_MSG = 'Waiting to fetch Testplan report...';
const FETCHING_MSG = 'Fetching Testplan report...';
const FINISHED_MSG = 'Please select an entry.';
const ERRORED_PREFIX_MSG = 'Error fetching Testplan report.';

const MessageStyled = props => (
  <Message left={`${COLUMN_WIDTH || 0}`} {...props}/>
);

const connector = connect(
  () => {
    const getStage = mkGetReportFetchStage();
    const getError = mkGetReportLastFetchError();
    const getProgress = _debounce(mkGetReportDownloadProgress(), 100);
    return state => {
      const { loaded, total, lengthComputable } = getProgress(state);
      return {
        loaded, total,
        hasProgress: !!lengthComputable,
        stage: getStage(state),
        error: getError(state),
      };
    };
  },
);

export default connector(({ stage, hasProgress, loaded, total, error }) => {
  const fetchingProcessingBits = stage & (
    Signals.FETCH_STAGE_MASK | Signals.PROCESS_STAGE_MASK
  );
  if(!!(stage & Signals.ERROR_MASK)) {
    const sfx = (typeof error === 'object' ? error.message : 0) || '';
    return (
      <MessageStyled message={`${ERRORED_PREFIX_MSG} ${sfx}`.trimRight()} />
    );
  }
  if(fetchingProcessingBits > Signals.FETCH_STARTED) {
    if(hasProgress) {
      const pct = 100 * loaded / total;
      const color = pct > 99 ? 'success' : 'info';
      const pctStr = pct.toFixed(1).padStart(5);
      const MessageFilled = () => (
        <>
          <h1>{`${FETCHING_MSG} ${pctStr}%`}</h1>
          <Progress value={pct} color={color}>
            <span style={{ 'text-overflow': 'ellipsis' }}>
              {`${humanReadableSize(loaded)} / ${humanReadableSize(total)}`}
            </span>
          </Progress>
        </>
      );
      return (<MessageStyled tag='span' message={MessageFilled}/>);
    }
    return (<MessageStyled message={FETCHING_MSG}/>);
  }
  if(fetchingProcessingBits >= Signals.PROCESSING_COMPLETE) {
    return (<MessageStyled message={FINISHED_MSG}/>);
  }
  return (<MessageStyled message={STARTING_MSG}/>);
});
