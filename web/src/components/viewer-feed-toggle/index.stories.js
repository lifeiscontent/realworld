import React from 'react';
import { ViewerFeedToggle } from '.';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'Tabs/ViewerFeedToggle',
  component: ViewerFeedToggle,
  decorators: [withNextRouter],
};

export const renders = () => <ViewerFeedToggle />;

renders.story = {
  parameters: {
    router: {
      pathname: '/',
    },
  },
};

export const feedEnabled = () => <ViewerFeedToggle username="lifeiscontent" />;

feedEnabled.story = {
  parameters: {
    router: {
      pathname: '/',
    },
  },
};

export const feedActive = () => <ViewerFeedToggle username="lifeiscontent" />;

feedActive.story = {
  parameters: {
    router: {
      pathname: '/feed',
    },
  },
};
