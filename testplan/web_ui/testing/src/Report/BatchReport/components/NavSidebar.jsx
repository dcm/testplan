import React from 'react';
import ListGroup from 'reactstrap/lib/ListGroup';
import { css } from 'aphrodite/es';
import connect from 'react-redux/es/connect/connect';

import { mkGetUIFilter } from '../state/uiSelectors';
import { isFilteredOut, safeGetNumPassedFailedErrored } from '../utils';
import BoundStyledListGroupItemLink from './BoundStyledListGroupItemLink';
import Column from '../../../Nav/Column';
import { COLUMN_WIDTH } from '../../../Common/defaults';
import { navListStyles } from '../style';
import EmptyListGroupItem from './EmptyListGroupItem';

const connector = connect(
  () => {
    const getFilter = mkGetUIFilter();
    return state => ({
      filter: getFilter(state),
      buttonListClasses: css(navListStyles.buttonList),
      colWidthStr: `${COLUMN_WIDTH}`,
    });
  },
);

export default connector(({
  entries, filter, buttonListClasses, colWidthStr
}) => {
  const items = entries.map((entry, idx) => {
    const [
      nPass, nFail, nErr,
    ] = safeGetNumPassedFailedErrored(entry.counter, 0);
    return isFilteredOut(filter, [ nPass, nFail, nErr ]) ? null : (
      <BoundStyledListGroupItemLink entry={entry}
                                    idx={idx}
                                    key={`${idx}`}
                                    nPass={nPass}
                                    nFail={nFail}
      />
    );
  }).filter(Boolean);
  return (
    <Column width={colWidthStr}>
      <ListGroup className={buttonListClasses}>
        {items.length ? items : <EmptyListGroupItem/>}
      </ListGroup>
    </Column>
  );
});
