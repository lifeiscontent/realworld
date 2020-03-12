import React from 'react';
import { ArticleInfo } from '.';
import { withRouter } from '../../utils/storybook';

export default {
  title: 'ArticleInfo',
  component: ArticleInfo,
  decorators: [withRouter]
};

export const renders = () => (
  <ArticleInfo
    createdAt={new Date(2000, 2, 1).toISOString()}
    author={{ username: 'lifeiscontent' }}
  />
);
