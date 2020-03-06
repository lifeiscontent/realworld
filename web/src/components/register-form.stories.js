import React from 'react';
import { RegisterForm } from './register-form';
import { action } from '@storybook/addon-actions';

export default {
  title: 'RegisterForm',
  component: RegisterForm
};

const handleSubmit = action('onSubmit');

export const renders = () => <RegisterForm onSubmit={handleSubmit} />;
