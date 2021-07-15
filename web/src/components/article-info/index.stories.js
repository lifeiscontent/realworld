import React from 'react';
import { ArticleInfo } from '.';

export default {
  title: 'Content/ArticleInfo',
  component: ArticleInfo,
};

export const renders = () => (
  <ArticleInfo
    createdAt={new Date(2000, 2, 1).toISOString()}
    author={{ username: 'lifeiscontent' }}
  />
);
