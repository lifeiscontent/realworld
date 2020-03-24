import React from 'react';
import { UserFollowButton } from '.';
import { withNextRouter } from 'storybook-addon-next-router';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Buttons/UserFollowButton',
  component: UserFollowButton,
  decorators: [withNextRouter],
};

export const renders = () => (
  <UserFollowButton
    onFollow={action('onFollow')}
    onUnfollow={action('onUnfollow')}
    username="lifeiscontent"
  />
);

export const canFollow = () => (
  <UserFollowButton
    canFollow={{ value: true }}
    onFollow={action('onFollow')}
    onUnfollow={action('onUnfollow')}
    username="lifeiscontent"
  />
);

export const canUnfollow = () => (
  <UserFollowButton
    canUnfollow={{ value: true }}
    followersCount={1}
    onFollow={action('onFollow')}
    onUnfollow={action('onUnfollow')}
    username="lifeiscontent"
    viewerIsFollowing
  />
);
