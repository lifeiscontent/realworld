import React from 'react';
import { UserArticlesToggle } from '.';
import { withRouter } from '../../utils/storybook';

export default {
  title: 'Tabs/UserArticlesToggle',
  component: UserArticlesToggle,
  decorators: [withRouter]
};

export const renders = () => <UserArticlesToggle username="lifeiscontent" />;

export const myArticlesActive = () => (
  <UserArticlesToggle username="lifeiscontent" />
);

myArticlesActive.story = {
  parameters: {
    router: {
      pathname: '/[username]'
    }
  }
};

export const favoritedArticlesActive = () => (
  <UserArticlesToggle username="lifeiscontent" />
);

favoritedArticlesActive.story = {
  parameters: {
    router: {
      pathname: '/[username]/favorites'
    }
  }
};
