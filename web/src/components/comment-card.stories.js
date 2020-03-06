import React from 'react';
import { CommentCard } from './comment-card';
import { withRouter } from '../utils/storybook';
import { action } from '@storybook/addon-actions';

export default {
  title: 'CommentCard',
  component: CommentCard,
  decorators: [withRouter]
};

export const renders = () => (
  <CommentCard
    author={{ username: 'lifeiscontent' }}
    body="Hello world!"
    createdAt={new Date(2000, 2, 1).toISOString()}
    id="1"
    onDelete={action('onDelete')}
  />
);

export const canDelete = () => (
  <CommentCard
    author={{ username: 'lifeiscontent' }}
    body="Hello world!"
    createdAt={new Date(2000, 2, 1).toISOString()}
    id="1"
    canDelete={{ value: true }}
    onDelete={action('onDelete')}
  />
);
