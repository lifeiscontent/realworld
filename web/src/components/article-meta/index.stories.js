import React from 'react';
import { ArticleMeta } from '.';
import { withRouter } from '../../utils/storybook';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Content/ArticleMeta',
  component: ArticleMeta,
  decorators: [withRouter]
};

export const renders = () => (
  <ArticleMeta
    author={{ username: 'lifeiscontent' }}
    createdAt={new Date(2000, 2, 1).toISOString()}
    onDelete={action('onDelete')}
    onFavorite={action('onFavorite')}
    onFollow={action('onFollow')}
    onUnfavorite={action('onUnfavorite')}
    onUnfollow={action('onUnfollow')}
    slug="a-simple-title"
  />
);

export const canDelete = () => (
  <ArticleMeta
    author={{ username: 'lifeiscontent' }}
    createdAt={new Date(2000, 2, 1).toISOString()}
    canDelete={{ value: true }}
    onDelete={action('onDelete')}
    onFavorite={action('onFavorite')}
    onFollow={action('onFollow')}
    onUnfavorite={action('onUnfavorite')}
    onUnfollow={action('onUnfollow')}
    slug="a-simple-title"
  />
);

export const canFavorite = () => (
  <ArticleMeta
    author={{ username: 'lifeiscontent' }}
    createdAt={new Date(2000, 2, 1).toISOString()}
    canFavorite={{ value: true }}
    onDelete={action('onDelete')}
    onFavorite={action('onFavorite')}
    onFollow={action('onFollow')}
    onUnfavorite={action('onUnfavorite')}
    onUnfollow={action('onUnfollow')}
    slug="a-simple-title"
  />
);

export const canFollow = () => (
  <ArticleMeta
    author={{ username: 'lifeiscontent', canFollow: { value: true } }}
    createdAt={new Date(2000, 2, 1).toISOString()}
    onDelete={action('onDelete')}
    onFavorite={action('onFavorite')}
    onFollow={action('onFollow')}
    onUnfavorite={action('onUnfavorite')}
    onUnfollow={action('onUnfollow')}
    slug="a-simple-title"
  />
);

export const canUnfavorite = () => (
  <ArticleMeta
    author={{ username: 'lifeiscontent' }}
    canUnfavorite={{ value: true }}
    createdAt={new Date(2000, 2, 1).toISOString()}
    favoritesCount={1}
    onDelete={action('onDelete')}
    onFavorite={action('onFavorite')}
    onFollow={action('onFollow')}
    onUnfavorite={action('onUnfavorite')}
    onUnfollow={action('onUnfollow')}
    slug="a-simple-title"
  />
);

export const canUnfollow = () => (
  <ArticleMeta
    author={{
      canUnfollow: { value: true },
      followersCount: 1,
      username: 'lifeiscontent',
      viewerIsFollowing: true
    }}
    createdAt={new Date(2000, 2, 1).toISOString()}
    onDelete={action('onDelete')}
    onFavorite={action('onFavorite')}
    onFollow={action('onFollow')}
    onUnfavorite={action('onUnfavorite')}
    onUnfollow={action('onUnfollow')}
    slug="a-simple-title"
  />
);
