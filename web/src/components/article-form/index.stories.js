import React from 'react';
import { ArticleForm } from '.';
import { MockedProvider } from '@apollo/react-testing';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Forms/ArticleForm',
  component: ArticleForm
};

const initialValues = {
  input: { title: '', description: '', body: '', tagIds: [] }
};

export const renders = () => (
  <MockedProvider>
    <ArticleForm initialValues={initialValues} onSubmit={action('onSubmit')} />
  </MockedProvider>
);
