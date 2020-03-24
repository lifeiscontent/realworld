import React from 'react';
import { ArticleInfo } from '.';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'Content/ArticleInfo',
  component: ArticleInfo,
  decorators: [withNextRouter],
};

export const renders = () => (
  <ArticleInfo
    createdAt={new Date(2000, 2, 1).toISOString()}
    author={{ username: 'lifeiscontent' }}
  />
);
