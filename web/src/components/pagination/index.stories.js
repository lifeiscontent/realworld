import React from 'react';
import { Pagination } from '.';

const meta = {
  title: 'Main/Pagination',
  component: Pagination,
};

export default meta;

const Template = args => <Pagination {...args} />;

export const Renders = Template.bind({});

export const HasNextPage = Template.bind({});

HasNextPage.args = {
  hasNextPage: true,
};

export const HasPreviousPage = Template.bind({});

HasPreviousPage.args = {
  hasPreviousPage: true,
};
