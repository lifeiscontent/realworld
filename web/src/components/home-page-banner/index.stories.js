import React from 'react';
import { HomePageBanner } from '.';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'Banners/HomePageBanner',
  component: HomePageBanner,
  decorators: [withNextRouter],
};

export const renders = () => <HomePageBanner />;
