import React from 'react';
import { ArticleDeleteButton } from '.';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Buttons/ArticleDeleteButton',
  component: ArticleDeleteButton,
};

export default meta;

const Template = args => <ArticleDeleteButton {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  onDelete: action('onDelete'),
  slug: 'a-simple-title',
};

export const CanDelete = Template.bind({});

CanDelete.args = {
  canDelete: { value: true },
  onDelete: action('onDelete'),
  slug: 'a-simple-title',
};
