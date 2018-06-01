import React from 'react';
import { shallow } from 'enzyme';
import { DefaultPage } from '../../../src/features/page-analysis/DefaultPage';

describe('page-analysis/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      pageAnalysis: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.page-analysis-default-page').length
    ).toBe(1);
  });
});
