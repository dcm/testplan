/// <reference types="jest" />
import React from 'react';
import { UIRouter } from '../';
import { shallow, mount, render } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

describe('UIRouter', () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
  it('renders correctly', () => {
    const tree = renderer.create(<UIRouter/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
