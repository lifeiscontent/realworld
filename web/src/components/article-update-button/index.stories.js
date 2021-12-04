import React from 'react';
import { ArticleUpdateButton } from '.';

const meta = {
  title: 'Buttons/ArticleUpdateButton',
  component: ArticleUpdateButton,
};

export default meta;

const Template = args => <ArticleUpdateButton {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  slug: 'a-simple-title',
};

export const CanUpdate = Template.bind({});

CanUpdate.args = {
  ...Renders.args,
  canUpdate: { value: true },
};
