import React from 'react';
import { UserCommentForm } from '.';
import { withNextRouter } from 'storybook-addon-next-router';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Forms/UserCommentForm',
  component: UserCommentForm,
  decorators: [withNextRouter],
};

export const renders = () => (
  <UserCommentForm
    username="lifeiscontent"
    onSubmit={action('onSubmit')}
  />
);

export const canCreateComment = () => (
  <UserCommentForm
    canCreateComment={{ value: true }}
    username="lifeiscontent"
    onSubmit={action('onSubmit')}
  />
);
