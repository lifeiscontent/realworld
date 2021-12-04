import React from 'react';
import { action } from '@storybook/addon-actions';
import { ArticlePageBanner } from '.';

const meta = {
  title: 'Banners/ArticlePageBanner',
  component: ArticlePageBanner,
};

export default meta;

const Template = args => <ArticlePageBanner {...args} />;

export const Renders = Template.bind({});
Renders.args = {
  author: {
    username: 'lifeiscontent',
  },
  createdAt: new Date(2000, 2, 1).toISOString(),
  onDelete: action('onDelete'),
  onFavorite: action('onFavorite'),
  onFollow: action('onFollow'),
  onUnfavorite: action('onUnfavorite'),
  onUnfollow: action('onUnfollow'),
  title: 'Some cool title',
  slug: 'some-cool-title',
};

export const CanFollow = Template.bind({});

CanFollow.args = {
  ...Renders.args,
  author: {
    ...Renders.args.author,
    canFollow: { value: true },
  },
};

export const CanUnfollow = Template.bind({});

CanUnfollow.args = {
  ...Renders.args,
  author: {
    ...Renders.args.author,
    canUnfollow: { value: true },
    viewerIsFollowing: true,
    followersCount: 1,
  },
};

export const CanFavorite = Template.bind({});

CanFavorite.args = {
  ...Renders.args,
  canFavorite: { value: true },
};

export const CanUnfavorite = Template.bind({});

CanUnfavorite.args = {
  ...Renders.args,
  canUnfavorite: { value: true },
  favoritesCount: 1,
  viewerDidFavorite: true,
};

export const CanUpdate = Template.bind({});

CanUpdate.args = {
  ...Renders.args,
  canUpdate: { value: true },
};

export const CanDelete = Template.bind({});

CanDelete.args = {
  ...Renders.args,
  canDelete: { value: true },
};
