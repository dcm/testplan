/// <reference types="jest" />
import React from 'react';
import { NavSidebar } from '../';
import { shallow, mount, render } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

describe('NavSidebar', () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
  it('renders correctly', () => {
    const tree = renderer.create(<NavSidebar/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
