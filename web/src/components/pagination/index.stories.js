import { Pagination } from '.';

const meta = {
  component: Pagination,
};

export default meta;

export const AsGuest = {};

export const HasNextPage = {};

HasNextPage.args = {
  hasNextPage: true,
};

export const HasPreviousPage = {};

HasPreviousPage.args = {
  hasPreviousPage: true,
};
