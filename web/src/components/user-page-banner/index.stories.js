import React from 'react';
import { UserPageBanner } from '.';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Banners/UserPageBanner',
  component: UserPageBanner,
};

export const renders = () => (
  <UserPageBanner
    onFollow={action('onFollow')}
    onUnfollow={action('onUnfollow')}
    username="lifeiscontent"
  />
);

export const canFollow = () => (
  <UserPageBanner
    canFollow={{ value: true }}
    onFollow={action('onFollow')}
    onUnfollow={action('onUnfollow')}
    username="lifeiscontent"
  />
);

export const canUnfollow = () => (
  <UserPageBanner
    canUnfollow={{ value: true }}
    followersCount={1}
    onFollow={action('onFollow')}
    onUnfollow={action('onUnfollow')}
    username="lifeiscontent"
    viewerIsFollowing
  />
);

export const canUpdate = () => (
  <UserPageBanner
    canUpdate={{ value: true }}
    onFollow={action('onFollow')}
    onUnfollow={action('onUnfollow')}
    username="lifeiscontent"
  />
);
