/** @jest-environment jsdom */
// @ts-nocheck
import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';
import { FilterButton } from '../';
import { getUIToolbarStyle } from '../../state/uiSelectors';
import { STATUS_CATEGORY } from '../../../../Common/defaults';

const SORTED_STATUS_STYLES = (() => {
  const a = Array.from(new Set(Object.values(STATUS_CATEGORY)).values());
  a.sort();
  return a.map(status => [ status, getUIToolbarStyle({ status }) ]);
})();

describe.each(SORTED_STATUS_STYLES)(
  'FilterButton, status="%s"',
  (status, style) => {

    beforeEach(() => {
      StyleSheetTestUtils.suppressStyleInjection();
    });

    afterEach(() => {
      StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
    });

    it('renders correctly', () => {
      const wrapper = shallow(<FilterButton toolbarStyle={style} />);
      expect(wrapper).toMatchSnapshot();
    });

  },
);
