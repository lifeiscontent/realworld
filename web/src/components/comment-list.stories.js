import React from 'react';
import { CommentList } from './comment-list';
import { withRouter } from '../utils/storybook';
import { action } from '@storybook/addon-actions';

export default {
  title: 'CommentList',
  component: CommentList,
  decorators: [withRouter]
};

export const renders = () => (
  <CommentList
    viewer={{ username: 'lifeiscontent' }}
    slug="a-demo-title"
    onDelete={action('onDelete')}
    onCreate={action('onCreate')}
  />
);

export const hasComments = () => (
  <CommentList
    viewer={{ username: 'lifeiscontent' }}
    slug="a-demo-title"
    onDelete={action('onDelete')}
    onCreate={action('onCreate')}
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

export const canCreate = () => (
  <CommentList
    viewer={{ username: 'lifeiscontent' }}
    slug="a-demo-title"
    onDelete={action('onDelete')}
    onCreate={action('onCreate')}
    canCreateComment={{ value: true }}
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
    viewer={{ username: 'lifeiscontent' }}
    slug="a-demo-title"
    onDelete={action('onDelete')}
    onCreate={action('onCreate')}
    canCreateComment={{ value: true }}
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
