import React from 'react';
import { ViewerFeedToggle } from '.';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'Tabs/ViewerFeedToggle',
  component: ViewerFeedToggle,
  decorators: [withNextRouter],
};

export const renders = () => <ViewerFeedToggle />;

renders.parameters = {
  nextRouter: {
    pathname: '/',
  },
};

export const feedEnabled = () => <ViewerFeedToggle username="lifeiscontent" />;

feedEnabled.parameters = {
  nextRouter: {
    pathname: '/',
  },
};

export const feedActive = () => <ViewerFeedToggle username="lifeiscontent" />;

feedActive.parameters = {
  nextRouter: {
    pathname: '/feed',
  },
};
