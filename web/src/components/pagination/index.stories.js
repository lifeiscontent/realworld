import React from 'react';
import { Pagination } from '.';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'Main/Pagination',
  component: Pagination,
  decorators: [withNextRouter],
};

export const renders = () => <Pagination />;

export const hasNextPage = () => <Pagination hasNextPage />;

export const hasPreviousPage = () => <Pagination hasPreviousPage />;
