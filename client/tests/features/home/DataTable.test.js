import React from 'react';
import { shallow } from 'enzyme';
import { DataTable } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DataTable />);
  expect(renderedComponent.find('.home-data-table').length).toBe(1);
});
