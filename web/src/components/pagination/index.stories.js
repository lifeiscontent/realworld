import { Pagination } from '.';

const meta = {
  component: Pagination,
};

export default meta;

export const AsGuest = {};

export const HasNextPage = {
  args: {
    hasNextPage: true,
  },
};

export const HasPreviousPage = {
  args: {
    hasPreviousPage: true,
  },
};
