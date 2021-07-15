import React from 'react';
import { UserArticlesToggle } from '.';

export default {
  title: 'Tabs/UserArticlesToggle',
  component: UserArticlesToggle,
};

export const renders = () => <UserArticlesToggle username="lifeiscontent" />;

export const myArticlesActive = () => (
  <UserArticlesToggle username="lifeiscontent" />
);

myArticlesActive.parameters = {
  nextRouter: {
    pathname: '/user/[username]',
  },
};

export const favoritedArticlesActive = () => (
  <UserArticlesToggle username="lifeiscontent" />
);

favoritedArticlesActive.parameters = {
  nextRouter: {
    pathname: '/user/[username]/favorites',
  },
};
