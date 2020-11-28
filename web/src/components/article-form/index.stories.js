import React from 'react';
import { ArticleForm } from '.';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Forms/ArticleForm',
  component: ArticleForm,
};

export const renders = () => <ArticleForm onSubmit={action('onSubmit')} />;
