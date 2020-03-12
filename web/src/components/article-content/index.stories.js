import React from 'react';
import { ArticleContent } from '.';
import { withRouter } from '../../utils/storybook';

export default {
  title: 'ArticleContent',
  component: ArticleContent,
  decorators: [withRouter]
};

export const renders = () => (
  <ArticleContent
    description="Web development technologies have evolved at an incredible clip over the past few years."
    body={`# Introducing RealWorld.\n\nIt's a great solution for learning how other frameworks work.`}
  />
);
