import React from 'react';
import { ArticleForm } from '.';
import { MockedProvider } from '@apollo/react-testing';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Forms/ArticleForm',
  component: ArticleForm
};

export const renders = () => (
  <MockedProvider>
    <ArticleForm onSubmit={action('onSubmit')} />
  </MockedProvider>
);
