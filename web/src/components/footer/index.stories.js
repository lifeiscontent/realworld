import React from 'react';
import { Footer } from '.';
import { withRouter } from '../../utils/storybook';

export default {
  title: 'Footer',
  component: Footer,
  decorators: [withRouter]
};

export const renders = () => <Footer />;
