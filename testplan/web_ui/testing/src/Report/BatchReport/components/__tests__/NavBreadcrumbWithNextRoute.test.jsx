/// <reference types="jest" />
import React from 'react';
import { NavBreadcrumbWithNextRoute } from '../';
import { shallow, mount, render } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

describe('NavBreadcrumbWithNextRoute', () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
  it('renders correctly', () => {
    const tree = renderer.create(<NavBreadcrumbWithNextRoute/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
