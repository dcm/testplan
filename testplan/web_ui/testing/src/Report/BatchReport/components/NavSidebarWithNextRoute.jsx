import React from 'react';
import { Redirect } from 'react-router';
import { Route } from 'react-router';
import { withRouter } from 'react-router';
import connect from 'react-redux/es/connect/connect';
import { setHashComponentAlias } from '../state/uiActions';
import { BOTTOMMOST_ENTRY_CATEGORY } from '../../../Common/defaults';
import { mkGetUIHashComponentToAlias } from '../state/uiSelectors';
import uriComponentCodec from '../../../Common/uriComponentCodec';
import NavSidebar from './NavSidebar';

const connector = connect(
  () => {
    const getHashComponentToAlias = mkGetUIHashComponentToAlias();
    return state => ({
      hashComponentToAlias: getHashComponentToAlias(state),
    });
  },
  {
    setHashComponentAlias
  },
  (stateProps, dispatchProps, ownProps) => {
    const { hashComponentToAlias } = stateProps;
    const { setHashComponentAlias } = dispatchProps;
    const {
      previousPath,
      bottommostPath,
      entries,
      // Assume:
      // - The route that was matched === "/aaa/bbb/ccc/:id"
      // - The URL that matched       === "/aaa/bbb/ccc/12345"
      // Then the value of the following variables are:
      // *       url = "/aaa/bbb/ccc/12345"
      // *      path = "/aaa/bbb/ccc/:id"
      // * params.id = "12345"
      match: { url, params: { id: encodedID } },
    } = ownProps;
    let tgtEntry = null;
    if(Array.isArray(entries)) {
      // ths incoming `encodedID` may be URL-encoded and so it won't match
      // `entry.name` in the `entries` array, so we grab whatever `id` is
      // actually an alias for, and use that to find our target `entry` object.
      let decodedID = hashComponentToAlias[encodedID];
      // on refresh on an aliased path, the `componentAliases` will be empty so
      // we need to fill it with the aliased component
      if(!decodedID) {
        decodedID = uriComponentCodec.decode(encodedID);
        setHashComponentAlias({ [decodedID]: encodedID });
      }
      tgtEntry = entries.find(e => decodedID === e.name);
    }
    return {
      tgtEntry,
      url,
      previousPath,
      bottommostPath,
    };
  },
);

const NavSidebarWithNextRoute = connector(withRouter(({
  tgtEntry, url, previousPath, bottommostPath
}) => {
  if(!tgtEntry) return null;
  const isBottommost = tgtEntry.category === BOTTOMMOST_ENTRY_CATEGORY;
  if(typeof bottommostPath === 'undefined' && isBottommost && previousPath) {
    bottommostPath = previousPath;
  }
  const routePath = typeof bottommostPath === 'string' ? bottommostPath : url;
  return (
    <>
      <Route exact path={routePath} render={() =>
        <NavSidebar entries={tgtEntry.entries}/>
      }/>
      <Route path={`${routePath}/:id`}>
        {(() => isBottommost ? <Redirect to={bottommostPath} push={false}/> : (
            <NavSidebarWithNextRoute entries={tgtEntry.entries}
                                     previousPath={routePath}
                                     bottommostPath={bottommostPath}
            />
          )
        )()}
      </Route>
    </>
  );
}));

export default NavSidebarWithNextRoute;
