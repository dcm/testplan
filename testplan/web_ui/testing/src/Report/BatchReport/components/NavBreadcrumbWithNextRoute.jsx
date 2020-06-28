import React from 'react';
import { Route } from 'react-router';
import { withRouter } from 'react-router';
import connect from 'react-redux/es/connect/connect';
import { mkGetUIHashComponentToAlias } from '../state/uiSelectors';
import { setHashComponentAlias } from '../state/uiActions';
import uriComponentCodec from '../../../Common/uriComponentCodec';
import NavBreadcrumb from './NavBreadcrumb';

const connector = connect(
  () => {
    const getHashComponentToAlias = mkGetUIHashComponentToAlias();
    return state => ({
      hashComponentToAlias: getHashComponentToAlias(state),
    });
  },
  {
    setHashComponentAlias,
  },
  (stateProps, dispatchProps, ownProps) => {
    const { hashComponentToAlias } = stateProps;
    const { setHashComponentAlias } = dispatchProps;
    const { entries, url, match: { params: { id: encodedID } } } = ownProps;
    let tgtEntry = null;
    if(Array.isArray(entries)) {
      let decodedID = hashComponentToAlias[encodedID];
      if(!decodedID) {
        decodedID = uriComponentCodec.decode(encodedID);
        setHashComponentAlias({ [decodedID]: encodedID });
      }
      tgtEntry = entries.find(e => decodedID === e.name);
    }
    return {
      tgtEntry,
      url,
    };
  },
);

const NavBreadcrumbWithNextRoute = connector(withRouter(({ tgtEntry, url }) => {
  return !tgtEntry ? null : (
    <>
      <NavBreadcrumb entry={tgtEntry}/>
      <Route path={`${url}/:id`} render={() =>
        <NavBreadcrumbWithNextRoute entries={tgtEntry.entries}/>
      }/>
    </>
  );
}));

export default NavBreadcrumbWithNextRoute;
