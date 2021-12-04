import React from 'react';
import { UserCommentForm } from '.';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Forms/UserCommentForm',
  component: UserCommentForm,
};

export default meta;

const Template = args => <UserCommentForm {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  onSubmit: action('onSubmit'),
  username: 'lifeiscontent',
};

export const CanCreateComment = Template.bind({});

CanCreateComment.args = {
  ...Renders.args,
  canCreateComment: { value: true },
};
