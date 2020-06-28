import React from 'react';
import { css } from 'aphrodite/es';
import Table from 'reactstrap/lib/Table';
import connect from 'react-redux/es/connect/connect';
import { mkGetReportDocument } from '../state/reportSelectors';
import navStyles from '../../../Toolbar/navStyles';

const connector = connect(
  () => {
    const getReportDocument = mkGetReportDocument();
    return state => ({
      reportDocument: getReportDocument(state),
      infoTableClasses: css(navStyles.infoTable),
      infoTableKeyClasses: css(navStyles.infoTableKey),
      infoTableValClasses: css(navStyles.infoTableValue),
    });
  },
);

export default connector(({
  reportDocument, infoTableClasses, infoTableKeyClasses, infoTableValClasses,
}) => React.useMemo(() => {
  if(!(reportDocument && reportDocument.information)) {
    return (
      <table>
        <tbody><tr><td>No information to display.</td></tr></tbody>
      </table>
    );
  }
  const infoList = reportDocument.information.map((item, i) => (
    <tr key={`${i}`}>
      <td className={infoTableKeyClasses}>{item[0]}</td>
      <td className={infoTableValClasses}>{item[1]}</td>
    </tr>
  ));
  if(reportDocument.timer && reportDocument.timer.run) {
    if(reportDocument.timer.run.start) {
      infoList.push(
        <tr key='start'>
          <td>start</td>
          <td>{reportDocument.timer.run.start}</td>
        </tr>,
      );
    }
    if(reportDocument.timer.run.end) {
      infoList.push(
        <tr key='end'>
          <td>end</td>
          <td>{reportDocument.timer.run.end}</td>
        </tr>,
      );
    }
  }
  return (
    <Table bordered responsive={true} className={infoTableClasses}>
      <tbody>{infoList}</tbody>
    </Table>
  );
}, [
  infoTableClasses, infoTableKeyClasses, infoTableValClasses, reportDocument,
]));
