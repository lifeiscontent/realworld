import React from 'react';
import { ArticleForm } from '.';
import { action } from '@storybook/addon-actions';
import { withApolloClient } from 'storybook-addon-apollo-client';

export default {
  title: 'Forms/ArticleForm',
  component: ArticleForm,
  decorators: [withApolloClient],
};

export const renders = () => <ArticleForm onSubmit={action('onSubmit')} />;
