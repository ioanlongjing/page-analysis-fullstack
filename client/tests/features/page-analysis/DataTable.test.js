import React from 'react';
import { shallow } from 'enzyme';
import { DataTable } from '../../../src/features/page-analysis';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DataTable />);
  expect(renderedComponent.find('.page-analysis-data-table').length).toBe(1);
});
