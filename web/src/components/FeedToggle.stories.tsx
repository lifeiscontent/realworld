import { expect } from 'storybook/test';
import preview from '../../.storybook/preview';
import { FeedToggle } from './FeedToggle';

const meta = preview.meta({
  title: 'Components/FeedToggle',
  component: FeedToggle,
  tags: ['autodocs'],
  args: { showYourFeed: false, feed: 'global' as const },
});

/** A guest has no feed. */
export const Guest = meta.story({
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('link', { name: 'Your Feed' })).toBeNull();
  },
});

export const YourFeed = meta.story({
  args: { showYourFeed: true, feed: 'following' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Your Feed' })).toHaveClass(
      'active'
    );
  },
});

/** A tag shows as a third tab. */
export const Tag = meta.story({
  args: { showYourFeed: true, feed: 'tag', tag: 'dragons' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: '#dragons' })).toHaveClass(
      'active'
    );
  },
});
