import React from 'react';
import { UserArticlesToggle } from '.';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'Tabs/UserArticlesToggle',
  component: UserArticlesToggle,
  decorators: [withNextRouter],
};

export const renders = () => <UserArticlesToggle username="lifeiscontent" />;

export const myArticlesActive = () => (
  <UserArticlesToggle username="lifeiscontent" />
);

myArticlesActive.story = {
  parameters: {
    router: {
      pathname: '/user/[username]',
    },
  },
};

export const favoritedArticlesActive = () => (
  <UserArticlesToggle username="lifeiscontent" />
);

favoritedArticlesActive.story = {
  parameters: {
    router: {
      pathname: '/user/[username]/favorites',
    },
  },
};
