import React from 'react';
import { ProfilePageBanner } from './profile-page-banner';
import { withRouter } from '../utils/storybook';
import { action } from '@storybook/addon-actions';

export default {
  title: 'ProfilePageBanner',
  component: ProfilePageBanner,
  decorators: [withRouter]
};

export const renders = () => (
  <ProfilePageBanner
    onFollow={action('onFollow')}
    onUnfollow={action('onUnfollow')}
    username="lifeiscontent"
  />
);

export const withFollow = () => (
  <ProfilePageBanner
    canFollow={{ value: true }}
    canUnfollow={{ value: true }}
    onFollow={action('onFollow')}
    onUnfollow={action('onUnfollow')}
    username="lifeiscontent"
  />
);

export const withoutFollow = () => (
  <ProfilePageBanner
    viewerIsFollowing
    canFollow={{ value: true }}
    canUnfollow={{ value: true }}
    onFollow={action('onFollow')}
    onUnfollow={action('onUnfollow')}
    username="lifeiscontent"
  />
);

export const withoutEdit = () => (
  <ProfilePageBanner isViewer username="lifeiscontent" />
);
