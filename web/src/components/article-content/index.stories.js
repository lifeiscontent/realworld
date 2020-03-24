import React from 'react';
import { ArticleContent } from '.';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'Content/ArticleContent',
  component: ArticleContent,
  decorators: [withNextRouter],
};

export const renders = () => (
  <ArticleContent
    description="Web development technologies have evolved at an incredible clip over the past few years."
    body={`# Introducing RealWorld.\n\nIt's a great solution for learning how other frameworks work.`}
  />
);
