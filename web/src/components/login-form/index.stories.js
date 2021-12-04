import React from 'react';
import { LoginForm } from '.';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Forms/LoginForm',
  component: LoginForm,
};

export default meta;

const Template = args => <LoginForm {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  onSubmit: action('onSubmit'),
};
