import React from 'react';
import { LoginForm } from '.';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Forms/LoginForm',
  component: LoginForm
};

const handleSubmit = action('onSubmit');

export const renders = () => <LoginForm onSubmit={handleSubmit} />;
