import React from 'react';
import { action } from '@storybook/addon-actions';
import { ArticlePageBanner } from './article-page-banner';
import { withRouter } from '../utils/storybook';

export default {
  title: 'ArticlePageBanner',
  component: ArticlePageBanner,
  decorators: [withRouter]
};

export const renders = () => (
  <ArticlePageBanner
    author={{
      username: 'lifeiscontent'
    }}
    createdAt={new Date(2000, 2, 1).toISOString()}
    onDelete={action('onDelete')}
    onFavorite={action('onFavorite')}
    onFollow={action('onFollow')}
    onUnfavorite={action('onUnfavorite')}
    onUnfollow={action('onUnfollow')}
    title="Some cool title"
    slug="some-cool-title"
  />
);

export const canFollow = () => (
  <ArticlePageBanner
    author={{
      username: 'lifeiscontent',
      canFollow: { value: true }
    }}
    createdAt={new Date(2000, 2, 1).toISOString()}
    onDelete={action('onDelete')}
    onFavorite={action('onFavorite')}
    onFollow={action('onFollow')}
    onUnfavorite={action('onUnfavorite')}
    onUnfollow={action('onUnfollow')}
    title="Some cool title"
    slug="some-cool-title"
  />
);

export const canUnfollow = () => (
  <ArticlePageBanner
    author={{
      username: 'lifeiscontent',
      canUnfollow: { value: true },
      viewerIsFollowing: true,
      followersCount: 1
    }}
    createdAt={new Date(2000, 2, 1).toISOString()}
    onDelete={action('onDelete')}
    onFavorite={action('onFavorite')}
    onFollow={action('onFollow')}
    onUnfavorite={action('onUnfavorite')}
    onUnfollow={action('onUnfollow')}
    title="Some cool title"
    slug="some-cool-title"
  />
);

export const canFavorite = () => (
  <ArticlePageBanner
    author={{
      username: 'lifeiscontent'
    }}
    canFavorite={{ value: true }}
    createdAt={new Date(2000, 2, 1).toISOString()}
    onDelete={action('onDelete')}
    onFavorite={action('onFavorite')}
    onFollow={action('onFollow')}
    onUnfavorite={action('onUnfavorite')}
    onUnfollow={action('onUnfollow')}
    slug="some-cool-title"
    title="Some cool title"
  />
);

export const canUnfavorite = () => (
  <ArticlePageBanner
    author={{
      username: 'lifeiscontent'
    }}
    canUnfavorite={{ value: true }}
    createdAt={new Date(2000, 2, 1).toISOString()}
    favoritesCount={1}
    onDelete={action('onDelete')}
    onFavorite={action('onFavorite')}
    onFollow={action('onFollow')}
    onUnfavorite={action('onUnfavorite')}
    onUnfollow={action('onUnfollow')}
    slug="some-cool-title"
    title="Some cool title"
    viewerDidFavorite
  />
);

export const canUpdate = () => (
  <ArticlePageBanner
    title="Some cool title"
    author={{
      username: 'lifeiscontent'
    }}
    canUpdate={{ value: true }}
    createdAt={new Date(2000, 2, 1).toISOString()}
    slug="some-cool-title"
    onDelete={action('onDelete')}
    onFavorite={action('onFavorite')}
    onFollow={action('onFollow')}
    onUnfavorite={action('onUnfavorite')}
    onUnfollow={action('onUnfollow')}
  />
);

export const canDelete = () => (
  <ArticlePageBanner
    title="Some cool title"
    author={{
      username: 'lifeiscontent'
    }}
    canDelete={{ value: true }}
    createdAt={new Date(2000, 2, 1).toISOString()}
    slug="some-cool-title"
    onDelete={action('onDelete')}
    onFavorite={action('onFavorite')}
    onFollow={action('onFollow')}
    onUnfavorite={action('onUnfavorite')}
    onUnfollow={action('onUnfollow')}
  />
);
