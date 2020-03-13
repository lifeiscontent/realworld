import React from 'react';
import { Pagination } from '.';
import { withRouter } from '../../utils/storybook';

export default {
  title: 'Main/Pagination',
  component: Pagination,
  decorators: [withRouter]
};

export const renders = () => <Pagination />;

export const hasNextPage = () => <Pagination hasNextPage />;

export const hasPreviousPage = () => <Pagination hasPreviousPage />;
