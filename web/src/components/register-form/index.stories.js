import React from 'react';
import { RegisterForm } from '.';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Forms/RegisterForm',
  component: RegisterForm,
};

export default meta;

const Template = args => <RegisterForm {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  onSubmit: action('onSubmit'),
};
