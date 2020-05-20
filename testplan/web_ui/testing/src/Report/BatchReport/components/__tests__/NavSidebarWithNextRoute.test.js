/// <reference types="jest" />
import React from 'react';
import { NavSidebarWithNextRoute } from '../';
import { shallow, mount, render } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

describe('NavSidebarWithNextRoute', () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
  it('renders correctly', () => {
    const tree = renderer.create(<NavSidebarWithNextRoute/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
