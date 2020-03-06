import React from 'react';
import { HomePageBanner } from './home-page-banner';
import { withRouter } from '../utils/storybook';

export default {
  title: 'HomePageBanner',
  component: HomePageBanner,
  decorators: [withRouter]
};

export const renders = () => <HomePageBanner />;
