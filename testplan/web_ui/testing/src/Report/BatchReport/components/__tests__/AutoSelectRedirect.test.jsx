/// <reference types="jest" />
import React from 'react';
import { AutoSelectRedirect } from '../';
import { shallow, mount, render } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

describe('AutoSelectRedirect', () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
  it('renders correctly', () => {
    const tree = renderer.create(<AutoSelectRedirect/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
