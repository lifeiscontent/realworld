import React from 'react';
import { ArticleFavoriteButton } from '.';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Buttons/ArticleFavoriteButton',
  component: ArticleFavoriteButton
};

export const renders = () => (
  <ArticleFavoriteButton
    onFavorite={action('onFavorite')}
    onUnfavorite={action('onUnfavorite')}
    slug="a-simple-title"
  />
);

export const canFavorite = () => (
  <ArticleFavoriteButton
    onFavorite={action('onFavorite')}
    onUnfavorite={action('onUnfavorite')}
    slug="a-simple-title"
    canFavorite={{ value: true }}
  />
);

export const canUnfavorite = () => (
  <ArticleFavoriteButton
    canUnfavorite={{ value: true }}
    favoritesCount={1}
    onFavorite={action('onFavorite')}
    onUnfavorite={action('onUnfavorite')}
    slug="a-simple-title"
    viewerDidFavorite={true}
  />
);
