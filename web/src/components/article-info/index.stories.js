import { expect } from '@storybook/jest';
import { waitFor, within } from '@storybook/testing-library';
import { ArticleInfo } from '.';

const meta = {
  component: ArticleInfo,
  args: {
    author: { username: 'lifeiscontent' },
    createdAt: new Date(2000, 2, 1).toISOString(),
  },
};

export default meta;

export const AsGuest = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByText('lifeiscontent');
    const time = canvas.getByText('March 1st');

    await waitFor(() =>
      expect(time).toHaveAttribute(
        'datetime',
        new Date(2000, 2, 1).toISOString()
      )
    );
    await waitFor(() =>
      expect(link).toHaveAttribute('href', '/user/lifeiscontent')
    );
  },
};
