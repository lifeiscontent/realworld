import React from 'react';
import { ArticlePreview } from '.';
import { withNextRouter } from 'storybook-addon-next-router';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Content/ArticlePreview',
  component: ArticlePreview,
  decorators: [withNextRouter],
};

export const renders = () => (
  <ArticlePreview
    author={{ username: 'lifeiscontent', profile: {} }}
    title="Some cool title"
    description="web stuff"
    createdAt={new Date(2000, 2, 1).toISOString()}
    slug="some-cool-title"
    onFavorite={action('onFavorite')}
    onUnfavorite={action('onUnfavorite')}
  />
);

renders.parameters = {
  nextRouter: {
    pathname: '/',
  },
};

export const hasTags = () => (
  <ArticlePreview
    author={{ username: 'lifeiscontent', profile: {} }}
    title="Some cool title"
    description="web stuff"
    createdAt={new Date(2000, 2, 1).toISOString()}
    tags={[{ id: '1', name: 'programming' }]}
    slug="some-cool-title"
    onFavorite={action('onFavorite')}
    onUnfavorite={action('onUnfavorite')}
  />
);

hasTags.parameters = {
  nextRouter: {
    pathname: '/',
  },
};

export const canFavorite = () => (
  <ArticlePreview
    author={{
      username: 'lifeiscontent',
      profile: {},
    }}
    title="Some cool title"
    description="web stuff"
    createdAt={new Date(2000, 2, 1).toISOString()}
    slug="some-cool-title"
    viewerDidFavorite
    canFavorite={{ value: true }}
    onFavorite={action('onFavorite')}
    onUnfavorite={action('onUnfavorite')}
  />
);

canFavorite.parameters = {
  nextRouter: {
    pathname: '/',
  },
};

export const canUnfavorite = () => (
  <ArticlePreview
    author={{
      username: 'lifeiscontent',
      profile: {},
    }}
    title="Some cool title"
    description="web stuff"
    createdAt={new Date(2000, 2, 1).toISOString()}
    slug="some-cool-title"
    favoritesCount={1}
    canUnfavorite={{ value: true }}
    onFavorite={action('onFavorite')}
    onUnfavorite={action('onUnfavorite')}
  />
);

canUnfavorite.parameters = {
  nextRouter: {
    pathname: '/',
  },
};

export const withProfileImage = () => (
  <ArticlePreview
    author={{
      username: 'lifeiscontent',
      profile: {
        imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
    }}
    title="Some cool title"
    description="web stuff"
    createdAt={new Date(2000, 2, 1).toISOString()}
    slug="some-cool-title"
    viewerDidFavorite
    onFavorite={action('onFavorite')}
    onUnfavorite={action('onUnfavorite')}
  />
);

withProfileImage.parameters = {
  nextRouter: {
    pathname: '/',
  },
};
