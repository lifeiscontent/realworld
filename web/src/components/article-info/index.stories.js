import React from 'react';
import { ArticleInfo } from '.';

const meta = {
  title: 'Content/ArticleInfo',
  component: ArticleInfo,
};

export default meta;

const Template = args => <ArticleInfo {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  author: { username: 'lifeiscontent' },
  createdAt: new Date(2000, 2, 1).toISOString(),
};
