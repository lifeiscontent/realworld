import React from 'react';
import { ArticlesToggle } from '.';
import { withRouter } from '../../utils/storybook';

export default {
  title: 'Tabs/ArticlesToggle',
  component: ArticlesToggle,
  decorators: [withRouter]
};

export const renders = () => <ArticlesToggle username="lifeiscontent" />;

export const myArticlesActive = () => (
  <ArticlesToggle username="lifeiscontent" />
);

myArticlesActive.story = {
  parameters: {
    router: {
      pathname: '/[username]'
    }
  }
};

export const favoritedArticlesActive = () => (
  <ArticlesToggle username="lifeiscontent" />
);

favoritedArticlesActive.story = {
  parameters: {
    router: {
      pathname: '/[username]/favorites'
    }
  }
};
