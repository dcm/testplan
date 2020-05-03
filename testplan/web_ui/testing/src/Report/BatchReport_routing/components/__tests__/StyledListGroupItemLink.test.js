/// <reference types="jest" />
import React from 'react';
import { StyledListGroupItemLink } from '../';
import { shallow, mount, render } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

describe('StyledListGroupItemLink', () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
  it('renders correctly', () => {
    const tree = renderer.create(<StyledListGroupItemLink/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
