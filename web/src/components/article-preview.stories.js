import React from 'react';
import { ArticlePreview } from './article-preview';
import { withRouter } from '../utils/storybook';
import { action } from '@storybook/addon-actions';

export default {
  title: 'ArticlePreview',
  component: ArticlePreview,
  decorators: [withRouter]
};

export const renders = () => (
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

renders.story = {
  parameters: {
    router: {
      pathname: '/'
    }
  }
};

export const withFavorite = () => (
  <ArticlePreview
    author={{
      username: 'lifeiscontent',
      profile: {}
    }}
    title="Some cool title"
    description="web stuff"
    createdAt={new Date(2000, 2, 1).toISOString()}
    tags={[{ id: '1', name: 'programming' }]}
    slug="some-cool-title"
    viewerDidFavorite
    canFavorite={{ value: true }}
    canUnfavorite={{ value: true }}
    onFavorite={action('onFavorite')}
    onUnfavorite={action('onUnfavorite')}
  />
);

withFavorite.story = {
  parameters: {
    router: {
      pathname: '/'
    }
  }
};

export const withoutFavorite = () => (
  <ArticlePreview
    author={{
      username: 'lifeiscontent',
      profile: {}
    }}
    title="Some cool title"
    description="web stuff"
    createdAt={new Date(2000, 2, 1).toISOString()}
    tags={[{ id: '1', name: 'programming' }]}
    slug="some-cool-title"
    canFavorite={{ value: true }}
    canUnfavorite={{ value: true }}
    onFavorite={action('onFavorite')}
    onUnfavorite={action('onUnfavorite')}
  />
);

withoutFavorite.story = {
  parameters: {
    router: {
      pathname: '/'
    }
  }
};

export const withProfileImage = () => (
  <ArticlePreview
    author={{
      username: 'lifeiscontent',
      profile: {
        imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
      }
    }}
    title="Some cool title"
    description="web stuff"
    createdAt={new Date(2000, 2, 1).toISOString()}
    tags={[{ id: '1', name: 'programming' }]}
    slug="some-cool-title"
    viewerDidFavorite
    onFavorite={action('onFavorite')}
    onUnfavorite={action('onUnfavorite')}
  />
);

withProfileImage.story = {
  parameters: {
    router: {
      pathname: '/'
    }
  }
};
