import React from 'react';
import { CommentForm } from './comment-form';
import { withRouter } from '../utils/storybook';
import { action } from '@storybook/addon-actions';

export default {
  title: 'CommentForm',
  component: CommentForm,
  decorators: [withRouter]
};

export const renders = () => (
  <CommentForm
    username="lifeiscontent"
    articleSlug="some-cool-title"
    onSubmit={action('onSubmit')}
  />
);
