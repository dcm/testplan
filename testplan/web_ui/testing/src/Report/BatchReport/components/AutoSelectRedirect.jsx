import React from 'react';
import { Redirect } from 'react-router';
import connect from 'react-redux/es/connect/connect';
import { mkGetUIDoAutoSelect } from '../state/uiSelectors';

const connector = connect(
  () => {
    const getDoAutoSelect = mkGetUIDoAutoSelect();
    return state => ({
      doAutoSelect: getDoAutoSelect(state),
    });
  },
  null,
  (stateProps, _, ownProps) => {
    const { doAutoSelect } = stateProps;
    const { basePath } = ownProps;
    let { entry } = ownProps;
    // trim trailing slashes from basePath and join with the first entry's name
    let toPath = `${basePath.replace(/\/+$/, '')}/${entry.name || ''}`;
    if(doAutoSelect) {
      while(entry.category !== 'testcase'
            && Array.isArray(entry.entries)
            && entry.entries.length === 1
            && typeof (entry = entry.entries[0] || {}) === 'object'
            && typeof (entry.name) === 'string'
        ) {
        toPath = `${toPath}/${entry.name}`;
      }
    }
    return {
      toPath,
    };
  },
);

export default connector(({ toPath }) => (
  <Redirect to={toPath} push={false}/>
));
