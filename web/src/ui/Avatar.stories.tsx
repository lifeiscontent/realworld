import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { Avatar } from './Avatar';

const meta = preview.meta({
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'jake', image: null, className: 'user-img' },
});

/** A user without an image gets the default avatar. */
export const DefaultAvatar = meta.story({
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'jake' })).toHaveAttribute(
      'src',
      '/images/default-avatar.svg'
    );
  },
});
