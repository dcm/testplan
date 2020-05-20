/// <reference types="jest" />
import React from 'react';
import { NavBreadcrumb } from '../';
import { shallow, mount, render } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

describe('NavBreadcrumb', () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
  it('renders correctly', () => {
    const tree = renderer.create(<NavBreadcrumb/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
