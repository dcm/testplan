import React from 'react';
import NavItem from 'reactstrap/lib/NavItem';
import { css } from 'aphrodite/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome/index.es';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import connect from 'react-redux/es/connect/connect';
import { mkGetDocumentationURL } from '../../../state/appSelectors';
import navStyles from '../../../Toolbar/navStyles';

library.add(faBook);

const connector = connect(
  () => {
    const getDocsURL = mkGetDocumentationURL();
    return state => ({
      docsURL: getDocsURL(state),
      docsIconName: faBook.iconName,
      docsIconClasses: css(navStyles.toolbarButton),
      docsAnchorClasses: css(navStyles.buttonsBar),
    });
  },
);

export default connector(({
  docsURL, docsIconName, docsIconClasses, docsAnchorClasses
}) => (
  <NavItem>
    <a href={docsURL}
       rel='noopener noreferrer'
       target='_blank'
       className={docsAnchorClasses}
    >
      <FontAwesomeIcon key='toolbar-document'
                       className={docsIconClasses}
                       icon={docsIconName}
                       title='Documentation'
      />
    </a>
  </NavItem>
));
