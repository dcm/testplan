/// <reference types="jest" />
import React from 'react';
import { BoundStyledListGroupItemLink } from '../';
import { shallow, mount, render } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

describe('BoundStyledListGroupItemLink', () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
  it('renders correctly', () => {
    const tree = renderer.create(<BoundStyledListGroupItemLink/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
