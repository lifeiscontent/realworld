import { fn } from 'storybook/test';
import { UserPageBanner } from '.';
import { buildAuthorizationResult } from '../../utils/storybook';

const meta = {
  component: UserPageBanner,
  args: {
    onFollow: fn(),
    onUnfollow: fn(),
    username: 'lifeiscontent',
  },
};

export default meta;

export const AsGuest = {};

export const CanFollow = {
  args: {
    canFollow: buildAuthorizationResult({ value: true }),
  },
};

export const CanUnfollow = {
  args: {
    canUnfollow: buildAuthorizationResult({ value: true }),
    followersCount: 1,
    viewerIsFollowing: true,
  },
};

export const CanUpdate = {
  args: {
    canUpdate: buildAuthorizationResult({ value: true }),
  },
};
