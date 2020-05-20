import React from 'react';
import { Redirect } from 'react-router';
import connect from 'react-redux/es/connect/connect';
import { getDoAutoSelect } from '../state/uiSelectors';

const connector = connect(state => ({ doAutoSelect: getDoAutoSelect(state), }));

/**
 * Jump ahead through objects with only one entry if we don't have
 * `doAutoSelect === false`
 * @param {React.PropsWithoutRef<{entry: any, basePath: string}>} props
 * @returns {Redirect}
 */
export default connector(({ entry, basePath, doAutoSelect }) => {
  // trim trailing slashes from basePath and join with the first entry's name
  let toPath = `${basePath.replace(/\/+$/, '')}/${entry.name || ''}`;
  if(doAutoSelect) {
    while(entry.category !== 'testcase'
          && Array.isArray(entry.entries)
          && entry.entries.length === 1
          && typeof (entry = entry.entries[0] || {}) === 'object'
          && typeof (entry.name) === 'string'
      ) { toPath = `${toPath}/${entry.name}`; }
  }
  return <Redirect to={toPath} push={false}/>;
});
