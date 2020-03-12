import React from 'react';
import { SettingsForm } from '.';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Forms/SettingsForm',
  component: SettingsForm
};

const handleSubmit = action('onSubmit');

const initialValues = {
  username: '',
  input: {
    email: '',
    password: '',
    username: '',
    profile: {
      bio: '',
      imageUrl: ''
    }
  }
};

export const renders = () => (
  <SettingsForm initialValues={initialValues} onSubmit={handleSubmit} />
);
