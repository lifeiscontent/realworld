import React from 'react';
import { ArticleContent } from '.';

const meta = {
  title: 'Content/ArticleContent',
  component: ArticleContent,
};

export default meta;

const Template = args => <ArticleContent {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  description:
    'Web development technologies have evolved at an incredible clip over the past few years.',
  body: `# Introducing RealWorld.\n\nIt's a great solution for learning how other frameworks work.`,
};
