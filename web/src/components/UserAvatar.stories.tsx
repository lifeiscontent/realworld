import { expect } from 'storybook/test';
import preview from '../../.storybook/preview';
import { UserAvatar } from './UserAvatar';

const meta = preview.meta({
  title: 'Components/UserAvatar',
  component: UserAvatar,
  tags: ['autodocs'],
  args: { username: 'jake', image: null, className: 'user-img' },
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
