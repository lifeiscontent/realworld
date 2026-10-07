import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { Pagination } from './Pagination';

const meta = preview.meta({
  title: 'UI/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { currentPage: 2, totalCount: 45 },
  parameters: { router: { url: '/tag/dragons?page=2' } },
});

/** The links keep the path and the other parameters of the URL. */
export const Default = meta.story({
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('link')).toHaveLength(5);
    await expect(canvas.getByRole('link', { name: '2' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    await expect(canvas.getByRole('link', { name: '1' })).toHaveAttribute(
      'href',
      '/tag/dragons'
    );
    await expect(canvas.getByRole('link', { name: '3' })).toHaveAttribute(
      'href',
      '/tag/dragons?page=3'
    );
  },
});

/** One page needs no pagination, so nothing shows. */
export const OnePage = meta.story({
  args: { currentPage: 1, totalCount: 7 },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('navigation')).toBeNull();
  },
});
