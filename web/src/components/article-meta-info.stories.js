import React from 'react';
import { ArticleMetaInfo } from './article-meta-info';
import { withRouter } from '../utils/storybook';

export default {
  title: 'ArticleMetaInfo',
  component: ArticleMetaInfo,
  decorators: [withRouter]
};

export const renders = () => (
  <ArticleMetaInfo
    userUsername="lifeiscontent"
    articleCreatedAt={new Date().toISOString()}
  />
);

// export const feedEnabled = () => <ArticleMetaInfo userUsername="lifeiscontent" />;

// export const feedActive = () => <ArticleMetaInfo userUsername="lifeiscontent" />;

// feedActive.story = {
//   parameters: {
//     router: {
//       pathname: '/feed'
//     }
//   }
// };
