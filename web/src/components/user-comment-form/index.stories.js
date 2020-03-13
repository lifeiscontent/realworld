import React from 'react';
import { UserCommentForm } from '.';
import { withRouter } from '../../utils/storybook';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Forms/UserCommentForm',
  component: UserCommentForm,
  decorators: [withRouter]
};

export const renders = () => (
  <UserCommentForm
    username="lifeiscontent"
    articleSlug="some-cool-title"
    onSubmit={action('onSubmit')}
  />
);

export const canCreateComment = () => (
  <UserCommentForm
    canCreateComment={{ value: true }}
    username="lifeiscontent"
    articleSlug="some-cool-title"
    onSubmit={action('onSubmit')}
  />
);
