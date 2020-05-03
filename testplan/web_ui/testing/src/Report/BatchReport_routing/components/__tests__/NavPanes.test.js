/// <reference types="jest" />
import React from 'react';
import { NavPanes } from '../';
import { shallow, mount, render } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

describe('NavPanes', () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
  it('renders correctly', () => {
    const tree = renderer.create(<NavPanes/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
