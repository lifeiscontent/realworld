import React from 'react';
import { FeedToggle } from './feed-toggle';
import { withRouter } from '../utils/storybook';

export default {
  title: 'FeedToggle',
  component: FeedToggle,
  decorators: [withRouter]
};

export const renders = () => <FeedToggle pathname="/" />;

export const feedEnabled = () => (
  <FeedToggle userUsername="lifeiscontent" pathname="/" />
);

export const feedActive = () => (
  <FeedToggle userUsername="lifeiscontent" pathname="/feed" />
);
