import React from 'react';
import { ArticleForm } from '.';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Forms/ArticleForm',
  component: ArticleForm,
};

export default meta;

const Template = args => <ArticleForm {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  onSubmit: action('onSubmit'),
};
