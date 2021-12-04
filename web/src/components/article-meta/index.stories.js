import React from 'react';
import { ArticleMeta } from '.';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Content/ArticleMeta',
  component: ArticleMeta,
};

export default meta;

const Template = args => <ArticleMeta {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  author: { username: 'lifeiscontent' },
  createdAt: new Date(2000, 2, 1).toISOString(),
  onDelete: action('onDelete'),
  onFavorite: action('onFavorite'),
  onFollow: action('onFollow'),
  onUnfavorite: action('onUnfavorite'),
  onUnfollow: action('onUnfollow'),
  slug: 'a-simple-title',
};

export const CanDelete = Template.bind({});

CanDelete.args = {
  ...Renders.args,
  canDelete: { value: true },
};

export const CanFavorite = Template.bind({});

CanFavorite.args = {
  ...Renders.args,
  canFavorite: { value: true },
};

export const CanFollow = Template.bind({});

CanFollow.args = {
  ...Renders.args,
  canFollow: { value: true },
};

export const CanUnfavorite = Template.bind({});

CanUnfavorite.args = {
  ...Renders.args,
  canUnfavorite: { value: true },
  favoritesCount: 1,
};

export const CanUnfollow = Template.bind({});

CanUnfollow.args = {
  ...Renders.args,
  author: {
    canUnfollow: { value: true },
    followersCount: 1,
    username: 'lifeiscontent',
    viewerIsFollowing: true,
  },
};
