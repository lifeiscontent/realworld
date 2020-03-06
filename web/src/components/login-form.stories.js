import React from 'react';
import { LoginForm } from './login-form';
import { action } from '@storybook/addon-actions';

export default {
  title: 'LoginForm',
  component: LoginForm
};

const handleSubmit = action('onSubmit');

export const renders = () => <LoginForm onSubmit={handleSubmit} />;
