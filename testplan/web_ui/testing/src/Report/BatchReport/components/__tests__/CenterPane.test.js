/// <reference types="jest" />
import React from 'react';
import { CenterPane } from '../';
import { shallow, mount, render } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

describe('CenterPane', () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
  it('renders correctly', () => {
    const tree = renderer.create(<CenterPane/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
