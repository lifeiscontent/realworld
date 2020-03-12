import React from 'react';
import { CommentList } from '.';
import { withRouter } from '../../utils/storybook';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Lists/CommentList',
  component: CommentList,
  decorators: [withRouter]
};

export const renders = () => <CommentList onDelete={action('onDelete')} />;

export const hasComments = () => (
  <CommentList
    onDelete={action('onDelete')}
    comments={[
      {
        id: '1',
        body: 'hello world',
        author: { username: 'lifeiscontent' },
        createdAt: new Date(2000, 2, 1).toISOString()
      },
      {
        id: '2',
        body: 'hello!',
        author: { username: 'ajtoo' },
        createdAt: new Date(2000, 2, 2).toISOString()
      }
    ]}
  />
);

export const canDelete = () => (
  <CommentList
    onDelete={action('onDelete')}
    comments={[
      {
        canDelete: { value: true },
        id: '1',
        body: 'hello world',
        author: { username: 'lifeiscontent' },
        createdAt: new Date(2000, 2, 1).toISOString()
      },
      {
        id: '2',
        body: 'hello!',
        author: { username: 'ajtoo' },
        createdAt: new Date(2000, 2, 2).toISOString()
      }
    ]}
  />
);
