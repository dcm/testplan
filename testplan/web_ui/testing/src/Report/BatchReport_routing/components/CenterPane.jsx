import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';

import AssertionPane from '../../../AssertionPane/AssertionPane';
import { COLUMN_WIDTH } from '../../../Common/defaults';
import Message from '../../../Common/Message';
import { actionTypes } from '../state';

const {
  APP_BATCHREPORT_CENTERPANEL_PLACEHOLDER_MSG,
  APP_BATCHREPORT_FETCHING_MSG,
  APP_BATCHREPORT_LOADING_MSG,
  APP_BATCHREPORT_FETCH_ERROR_MSG_PRELUDE,
  APP_BATCHREPORT_FETCHING,
  APP_BATCHREPORT_LOADING,
  APP_BATCHREPORT_FETCH_ERROR,
  APP_BATCHREPORT_SELECTED_TEST_CASE,
  APP_BATCHREPORT_JSON_REPORT,
  APP_BATCHREPORT_FILTER,
} = actionTypes;
const connector = connect(
  state => ({
    placeholderMessage: state[APP_BATCHREPORT_CENTERPANEL_PLACEHOLDER_MSG],
    isFetchingMessage: state[APP_BATCHREPORT_FETCHING_MSG],
    isLoadingMessage: state[APP_BATCHREPORT_LOADING_MSG],
    errorMessagePrelude: state[APP_BATCHREPORT_FETCH_ERROR_MSG_PRELUDE],
    isFetching: state[APP_BATCHREPORT_FETCHING],
    isLoading: state[APP_BATCHREPORT_LOADING],
    fetchError: state[APP_BATCHREPORT_FETCH_ERROR],
    selectedTestCase: state[APP_BATCHREPORT_SELECTED_TEST_CASE],
    jsonReport: state[APP_BATCHREPORT_JSON_REPORT],
    filter: state[APP_BATCHREPORT_FILTER],
  }),
);

/**
 * The center pane
 * @returns {React.FunctionComponentElement}
 */
const CenterPane = connector(({
  placeholderMessage = '',
  isFetchingMessage = '',
  isLoadingMessage = '',
  errorMessagePrelude = '',
  isFetching,
  isLoading,
  fetchError,
  selectedTestCase,
  jsonReport,
  filter,
}) => {
  const messageLeft = `${COLUMN_WIDTH || 0}`,
    assertPaneLeft = `${(COLUMN_WIDTH || 0) + 1.5}`,
    message = fetchError instanceof Error ?
      `${errorMessagePrelude} ${fetchError.message}` :
      isFetching ?
        isFetchingMessage :
        isLoading ?
          isLoadingMessage :
          null;
  if(message !== null) {
    return <Message left={messageLeft} message={message} />;
  } else if(selectedTestCase !== null) {
    const
      { uid: testcaseUid,
        logs,
        entries: assertions,
        description,
      } = selectedTestCase,
      descriptionEntries = [ description ],
      { uid: reportUid } = jsonReport,
      hasValidAssertions = Array.isArray(assertions) && assertions.length > 0,
      hasValidLogs = Array.isArray(logs) && logs.length > 0;
    if(hasValidAssertions || hasValidLogs) {
      return (
        <AssertionPane assertions={assertions}
                       logs={logs}
                       descriptionEntries={descriptionEntries}
                       left={assertPaneLeft}
                       testcaseUid={testcaseUid}
                       filter={filter}
                       reportUid={reportUid}
        />
      );
    }
  }
  return (
    <Message left={messageLeft} message={placeholderMessage}/>
  );
});
CenterPane.propTypes = {
  placeholderMessage: PropTypes.string,
  isFetchingMessage: PropTypes.string,
  isLoadingMessage: PropTypes.string,
  errorMessagePrelude: PropTypes.string,
  assertions: PropTypes.string,
  logs: PropTypes.any,
  filter: PropTypes.oneOf([ 'all', 'pass', 'fail' ]),
  reportUid: PropTypes.string,
  testcaseUid: PropTypes.string,
  description: PropTypes.string,
};

export default CenterPane;
