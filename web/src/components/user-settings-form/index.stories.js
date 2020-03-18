import React from 'react';
import { UserSettingsForm } from '.';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Forms/UserSettingsForm',
  component: UserSettingsForm
};

const handleSubmit = action('onSubmit');

export const renders = () => (
  <UserSettingsForm
    onSubmit={handleSubmit}
    username="john"
    email="john@example.com"
  />
);
