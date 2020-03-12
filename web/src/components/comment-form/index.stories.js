import React from 'react';
import { CommentForm } from '.';
import { withRouter } from '../../utils/storybook';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Forms/CommentForm',
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

export const canCreateComment = () => (
  <CommentForm
    canCreateComment={{ value: true }}
    username="lifeiscontent"
    articleSlug="some-cool-title"
    onSubmit={action('onSubmit')}
  />
);
