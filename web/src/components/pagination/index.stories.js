import React from 'react';
import { Pagination } from '.';
import { withRouter } from '../../utils/storybook';

export default {
  title: 'Main/Pagination',
  component: Pagination,
  decorators: [withRouter]
};

export const renders = () => <Pagination />;

export const hasNextPage = () => (
  <Pagination pageInfo={{ hasNextPage: true }} />
);

export const hasPreviousPage = () => (
  <Pagination pageInfo={{ hasPreviousPage: true }} />
);
