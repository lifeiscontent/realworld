import React from 'react';
import { ArticleFavoriteButton } from '.';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Buttons/ArticleFavoriteButton',
  component: ArticleFavoriteButton,
};

export default meta;

const Template = args => <ArticleFavoriteButton {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  onFavorite: action('onFavorite'),
  onUnfavorite: action('onUnfavorite'),
  slug: 'a-simple-title',
};

export const CanFavorite = Template.bind({});

CanFavorite.args = {
  onFavorite: action('onFavorite'),
  onUnfavorite: action('onUnfavorite'),
  slug: 'a-simple-title',
  canFavorite: { value: true },
};

export const CanUnfavorite = Template.bind({});

CanUnfavorite.args = {
  canUnfavorite: { value: false },
  favoritesCount: 1,
  onFavorite: action('onFavorite'),
  onUnfavorite: action('onUnfavorite'),
  slug: 'a-simple-title',
  viewerDidFavorite: true,
};
