import React from 'react';
import { ArticleDeleteButton } from '.';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Buttons/ArticleDeleteButton',
  component: ArticleDeleteButton,
};

export const renders = () => (
  <ArticleDeleteButton onDelete={action('onDelete')} slug="a-simple-title" />
);

export const canDelete = () => (
  <ArticleDeleteButton
    canDelete={{ value: true }}
    onDelete={action('onDelete')}
    slug="a-simple-title"
  />
);
