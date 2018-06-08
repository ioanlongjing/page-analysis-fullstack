import React from 'react';
import { shallow } from 'enzyme';
import { FbContainer } from '../../../src/features/home/FbContainer';

describe('home/FbContainer', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <FbContainer {...props} />
    );

    expect(
      renderedComponent.find('.home-fb-container').length
    ).toBe(1);
  });
});
