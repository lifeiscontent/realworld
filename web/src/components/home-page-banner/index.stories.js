import React from 'react';
import { HomePageBanner } from '.';
import { withRouter } from '../../utils/storybook';

export default {
  title: 'Banners/HomePageBanner',
  component: HomePageBanner,
  decorators: [withRouter]
};

export const renders = () => <HomePageBanner />;
