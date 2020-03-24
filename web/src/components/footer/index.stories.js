import React from 'react';
import { Footer } from '.';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'Main/Footer',
  component: Footer,
  decorators: [withNextRouter],
};

export const renders = () => <Footer />;
