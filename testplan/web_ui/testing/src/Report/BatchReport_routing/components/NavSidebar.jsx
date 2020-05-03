import React from 'react';
import ListGroup from 'reactstrap/lib/ListGroup';
import { css } from 'aphrodite';

import connect from 'react-redux/es/connect/connect';
import { actionTypes } from '../state';
import { isFilteredOut, safeGetNumPassedFailedErrored } from '../utils';
import BoundStyledListGroupItemLink from './BoundStyledListGroupItemLink';
import Column from '../../../Nav/Column';
import { COLUMN_WIDTH } from '../../../Common/defaults';
import { navListStyles } from '../style';
import EmptyListGroupItem from './EmptyListGroupItem';

const { APP_BATCHREPORT_FILTER } = actionTypes;
const connector = connect(
  state => ({
    filter: state[APP_BATCHREPORT_FILTER],
  })
);

export default connector(({ entries, filter }) => {
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
  }).filter(e => !!e);
  return (
    <Column width={`${COLUMN_WIDTH}`}>
      <ListGroup className={css(navListStyles.buttonList)}>
        {items.length ? items : <EmptyListGroupItem/>}
      </ListGroup>
    </Column>
  );
});
