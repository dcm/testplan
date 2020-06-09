import React from 'react';
import connect from 'react-redux/es/connect/connect';
import { createSelector } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { mkGetUIFilter } from '../../state/uiSelectors';
import { mkGetUISelectedTestCase } from '../../state/uiSelectors';
import { mkGetReportDocument } from '../../state/reportSelectors';
import AssertionPane from '../../../../AssertionPane/AssertionPane';
import { COLUMN_WIDTH } from '../../../../Common/defaults';
import Placeholder from './Placeholder';

const isNonemptyArray = v => Array.isArray(v) && v.length > 0;

const connector = connect(
  () => {
    const getFilter = mkGetUIFilter();
    const getSelectedTestCase = createSelector(
      mkGetUISelectedTestCase(),
      tc => tc || {}
    );
    const getDocument = createSelector(
      mkGetReportDocument(),
      doc => doc || {}
    );
    return state => {
      return {
        filter: getFilter(state),
        selectedTestCase: getSelectedTestCase(state),
        document: getDocument(state),
        leftWidth: `${(COLUMN_WIDTH || 0) + 1.5}`,
      };
    };
  },
);

export default connector(({
  selectedTestCase, document, filter, leftWidth
}) => {
  const { uid: reportUID } = document;
  const { uid: testcaseUID, logs, entries, description } = selectedTestCase;
  const descriptionEntries = React.useMemo(
    () => isNonemptyArray(description) ? description : [ description ],
    [ description ]
  );
  if(isNonemptyArray(entries) || isNonemptyArray(entries)) {
    return (
      <AssertionPane assertions={entries}
                     logs={logs}
                     descriptionEntries={descriptionEntries}
                     left={leftWidth}
                     testcaseUid={testcaseUID}
                     filter={filter}
                     reportUid={reportUID}
      />
    );
  }
  return <Placeholder/>;
});
