import React from 'react';
import connect from 'react-redux/es/connect/connect';
import { createSelector } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { mkGetFilter } from '../../state/uiSelectors';
import { mkGetSelectedTestCase } from '../../state/uiSelectors';
import { mkGetReportDocument } from '../../state/reportSelectors';
import AssertionPane from '../../../../AssertionPane/AssertionPane';
import { COLUMN_WIDTH } from '../../../../Common/defaults';
import Placeholder from './Placeholder';

const isNonemptyArray = v => Array.isArray(v) && v.length > 0;

const connector = connect(
  () => {
    const getFilter = mkGetFilter();
    const getSelectedTestCase = createSelector(
      mkGetSelectedTestCase(),
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
      };
    };
  },
);

export default connector(({ selectedTestCase, document, filter }) => {
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
                     left={`${(COLUMN_WIDTH || 0) + 1.5}`}
                     testcaseUid={testcaseUID}
                     filter={filter}
                     reportUid={reportUID}
      />
    );
  }
  return <Placeholder/>;
});
