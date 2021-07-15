import React from 'react';
import { Pagination } from '.';

export default {
  title: 'Main/Pagination',
  component: Pagination,
};

export const renders = () => <Pagination />;

export const hasNextPage = () => <Pagination hasNextPage />;

export const hasPreviousPage = () => <Pagination hasPreviousPage />;
