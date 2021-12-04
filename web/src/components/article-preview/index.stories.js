import React from 'react';
import { ArticlePreview } from '.';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Content/ArticlePreview',
  component: ArticlePreview,
};

export default meta;

const Template = args => <ArticlePreview {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  author: {
    username: 'lifeiscontent',
    profile: {},
  },
  title: 'Some cool title',
  description: 'web stuff',
  slug: 'some-cool-title',
  onFavorite: action('onFavorite'),
  onUnfavorite: action('onUnfavorite'),
  createdAt: new Date(2000, 2, 1).toISOString(),
};

export const HasTags = Template.bind({});

HasTags.args = {
  ...Renders.args,
  tags: [{ id: '1', name: 'programming' }],
};

export const CanFavorite = Template.bind({});

CanFavorite.args = {
  ...Renders.args,
  canFavorite: { value: true },
  viewerDidFavorite: true,
};

export const CanUnfavorite = Template.bind({});

CanUnfavorite.args = {
  ...Renders.args,
  canUnfavorite: { value: true },
  favoritesCount: 1,
};

export const WithProfileImage = Template.bind({});

WithProfileImage.args = {
  ...Renders.args,
  author: {
    profile: {
      imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
  },
  viewerDidFavorite: true,
};
