import { within, expect } from '@storybook/test';
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

    await expect(time).toHaveAttribute(
      'datetime',
      new Date(2000, 2, 1).toISOString()
    );
    await expect(link).toHaveAttribute('href', '/user/lifeiscontent');
  },
};
