import React from 'react';
import { ViewerFeedToggle } from '.';

export default {
  title: 'Tabs/ViewerFeedToggle',
  component: ViewerFeedToggle,
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
