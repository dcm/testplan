import React from 'react';
import Progress from 'reactstrap/lib/Progress';
import connect from 'react-redux/es/connect/connect';
import _debounce from 'lodash/debounce';
import _isObject from 'lodash/isObject';
import {
  mkGetReportDownloadProgress,
  mkGetReportIsFetching,
  mkGetReportLastFetchError,
  mkGetReportDocument,
} from '../../state/reportSelectors';
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
    const getDocument = mkGetReportDocument();
    const getIsFetching = mkGetReportIsFetching();
    const getError = mkGetReportLastFetchError();
    const getProgress = _debounce(mkGetReportDownloadProgress(), 100);
    return state => ({
      progress: getProgress(state),
      isFetching: getIsFetching(state),
      error: getError(state),
      document: getDocument(state),
    });
  },
);

export default connector(({ progress, isFetching, error, document }) => {
  if(!isFetching && error) {
    const sfx = (typeof error === 'object' ? error.message : 0) || '';
    return (
      <MessageStyled message={`${ERRORED_PREFIX_MSG} ${sfx}`.trimRight()} />
    );
  }
  if(isFetching) {
    if(progress.lengthComputable) {
      const pct = 100 * progress.loaded / progress.total;
      const color = pct > 99 ? 'success' : 'info';
      const pctStr = pct.toFixed(1).padStart(5);
      const MessageFilled = () => (
        <>
          <h1>{`${FETCHING_MSG} ${pctStr}%`}</h1>
          <Progress value={pct} color={color}>
            <span style={{ 'text-overflow': 'ellipsis' }}>
              {
                `${humanReadableSize(progress.loaded)}` +
                ` / ` +
                `${humanReadableSize(progress.total)}`
              }
            </span>
          </Progress>
        </>
      );
      return (<MessageStyled tag='span' message={MessageFilled}/>);
    }
    return (<MessageStyled message={FETCHING_MSG}/>);
  }
  if(!isFetching && !error && _isObject(document)) {
    return (<MessageStyled message={FINISHED_MSG}/>);
  }
  return (<MessageStyled message={STARTING_MSG}/>);
});
