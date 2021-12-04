import React from 'react';
import { UserSettingsForm } from '.';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Forms/UserSettingsForm',
  component: UserSettingsForm,
};

export default meta;

const Template = args => <UserSettingsForm {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  onSubmit: action('onSubmit'),
  username: 'john',
  email: 'john@example.com',
};
