import React from 'react';
import { FeedToggle } from '.';
import { withRouter } from '../../utils/storybook';

export default {
  title: 'Tabs/FeedToggle',
  component: FeedToggle,
  decorators: [withRouter]
};

export const renders = () => <FeedToggle />;

renders.story = {
  parameters: {
    router: {
      pathname: '/'
    }
  }
};

export const feedEnabled = () => <FeedToggle userUsername="lifeiscontent" />;

feedEnabled.story = {
  parameters: {
    router: {
      pathname: '/'
    }
  }
};

export const feedActive = () => <FeedToggle userUsername="lifeiscontent" />;

feedActive.story = {
  parameters: {
    router: {
      pathname: '/feed'
    }
  }
};
