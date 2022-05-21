import { ArticlePageBanner } from '.';
import { buildAuthorizationResult } from '../../utils/storybook';

const meta = {
  component: ArticlePageBanner,
  args: {
    author: {
      username: 'lifeiscontent',
    },
    createdAt: new Date(2000, 2, 1).toISOString(),
    slug: 'some-cool-title',
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

export const CanFollow = {
  args: {
    author: {
      ...meta.args.author,
      canFollow: buildAuthorizationResult({ value: true }),
    },
  },
};

export const CanUnfollow = {
  args: {
    author: {
      ...meta.args.author,
      canUnfollow: buildAuthorizationResult({ value: true }),
      viewerIsFollowing: true,
      followersCount: 1,
    },
  },
};

export const CanFavorite = {
  args: {
    canFavorite: buildAuthorizationResult({ value: true }),
  },
};

export const CanUnfavorite = {
  args: {
    canUnfavorite: buildAuthorizationResult({ value: true }),
    favoritesCount: 1,
    viewerDidFavorite: true,
  },
};

export const CanUpdate = {
  args: {
    canUpdate: buildAuthorizationResult({ value: true }),
  },
};

export const CanDelete = {
  args: {
    canDelete: buildAuthorizationResult({ value: true }),
  },
};
