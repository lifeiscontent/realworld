import React from 'react';
import { CommentCard } from '.';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Cards/CommentCard',
  component: CommentCard,
};

export default meta;

const Template = args => <CommentCard {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  author: { username: 'lifeiscontent' },
  body: 'Hello world!',
  createdAt: new Date(200, 2, 1).toISOString(),
  id: '1',
  onDelete: action('onDelete'),
};

export const CanDelete = Template.bind({});

CanDelete.args = {
  ...Renders.args,
  canDelete: { value: true },
};
