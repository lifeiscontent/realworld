import { expect } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { author } from '../../stories/fixtures';
import { ProfileInfo } from './ProfileInfo';

const meta = preview.meta({
  title: 'Features/Profile/ProfileInfo',
  component: ProfileInfo,
  tags: ['autodocs'],
  args: { profile: author, isViewer: false },
});

/** Other users can follow the user. */
export const Other = meta.story({
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /Follow anah/ })
    ).toBeVisible();
  },
});

export const Following = meta.story({
  args: { profile: { ...author, following: true } },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /Unfollow anah/ })
    ).toBeVisible();
  },
});

/** The viewer gets a link to the settings. */
export const Viewer = meta.story({
  args: { isViewer: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('link', { name: /Edit Profile Settings/ })
    ).toHaveAttribute('href', '/settings');
  },
});
