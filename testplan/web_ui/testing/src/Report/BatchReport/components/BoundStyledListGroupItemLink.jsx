import React from 'react';
import { withRouter } from 'react-router';
import connect from 'react-redux/es/connect/connect';

import { mkGetUIIsShowTags } from '../state/uiSelectors';
import { setHashComponentAlias } from '../state/uiActions';
import { setSelectedTestCase } from '../state/uiActions';
import { BOTTOMMOST_ENTRY_CATEGORY } from '../../../Common/defaults';
import { uriComponentCodec } from '../utils';
import StyledListGroupItemLink from './StyledListGroupItemLink';
import TagList from '../../../Nav/TagList';
import NavEntry from '../../../Nav/NavEntry';

const connector = connect(
  () => {
    const getIsShowTags = mkGetUIIsShowTags();
    return state => ({
      isShowTags: getIsShowTags(state),
    });
  },
  {
    setSelectedTestCase,
    setHashComponentAlias,
  },
  (stateProps, dispatchProps, ownProps) => {
    const { isShowTags } = stateProps;
    const { setSelectedTestCase, setHashComponentAlias } = dispatchProps;
    const { entry, idx, nPass, nFail, match: { url: matchedUrl } } = ownProps;
    return {
      isShowTags,
      setSelectedTestCase,
      setHashComponentAlias,
      entry,
      idx,
      nPass,
      nFail,
      matchedUrl,
    };
  }
);

export default connector(withRouter(({
  entry, idx, nPass, nFail, isShowTags, setHashComponentAlias,
  setSelectedTestCase, matchedUrl
}) => {
  const { name, status, category, tags, uid } = entry,
    isBottommost = category === BOTTOMMOST_ENTRY_CATEGORY,
    encodedName = uriComponentCodec.encode(name),
    nextPathname = isBottommost ? matchedUrl : `${matchedUrl}/${encodedName}`,
    onClickOverride = !isBottommost ? {
      onClick() { setSelectedTestCase(null); },
    } : {
      onClick(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        setSelectedTestCase(entry);
      },
    };
  setHashComponentAlias(encodedName, name);
  return (
    <StyledListGroupItemLink key={uid}
                             dataUid={uid}
                             tabIndex={`${idx + 1}`}
                             pathname={nextPathname}
                             {...onClickOverride}
    >
      {
        isShowTags && tags
          ? <TagList entryName={name} tags={tags}/>
          : null
      }
      <NavEntry caseCountPassed={nPass}
                caseCountFailed={nFail}
                type={category}
                status={status}
                name={name}
      />
    </StyledListGroupItemLink>
  );
}));
