import { userEvent, expect, within } from '@storybook/test';
import { ArticleMeta } from '.';
import { buildAuthorizationResult } from '../../utils/storybook';

const meta = {
  component: ArticleMeta,
  args: {
    author: {
      canFollow: buildAuthorizationResult(),
      canUnfollow: buildAuthorizationResult(),
      createdAt: new Date(2000, 2, 1).toISOString(),
      followersCount: 0,
      username: 'lifeiscontent',
      viewerIsFollowing: false,
    },
    canFavorite: buildAuthorizationResult(),
    canUnfavorite: buildAuthorizationResult(),
    createdAt: new Date(2000, 2, 1).toISOString(),
    favoritesCount: 0,
    slug: 'a-simple-title',
    viewerDidFavorite: false,
  },
  argTypes: {
    onDelete: { action: true },
    onFavorite: { action: true },
    onFollow: { action: true },
    onUnfavorite: { action: true },
    onUnfollow: { action: true },
  },
};

export default meta;

export const AsGuest = {};

export const AsAuthorCanDelete = {
  args: {
    canDelete: buildAuthorizationResult({ value: true }),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', {
        name: new RegExp('Delete Article', 'i'),
      })
    );

    await expect(args.onDelete).toHaveBeenCalled();
  },
};

export const AsUserWhoHasNotFavoritedCanFavorite = {
  args: {
    canFavorite: buildAuthorizationResult({ value: true }),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', {
        name: new RegExp('Favorite Article', 'i'),
      })
    );

    await expect(args.onFavorite).toHaveBeenCalled();
  },
};

export const AsUserWhoHasNotFollowedCanFollow = {
  args: {
    author: {
      ...meta.args.author,
      canFollow: buildAuthorizationResult({ value: true }),
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', {
        name: new RegExp('Follow lifeiscontent \\(0\\)', 'i'),
      })
    );

    await expect(args.onFollow).toHaveBeenCalled();
  },
};

export const AsUserWhoHasFavoritedCanUnfavorite = {
  args: {
    canUnfavorite: buildAuthorizationResult({ value: true }),
    favoritesCount: 1,
    viewerDidFavorite: true,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', {
        name: new RegExp('Unfavorite Article \\(1\\)', 'i'),
      })
    );

    await expect(args.onUnfavorite).toHaveBeenCalled();
  },
};

export const AsUserWhoHasFollowedCanUnfollow = {
  args: {
    author: {
      ...meta.args.author,
      canUnfollow: buildAuthorizationResult({ value: true }),
      followersCount: 1,
      viewerIsFollowing: true,
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', {
        name: new RegExp('Unfollow lifeiscontent \\(1\\)', 'i'),
      })
    );

    await expect(args.onUnfollow).toHaveBeenCalled();
  },
};
