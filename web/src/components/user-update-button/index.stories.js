import React from 'react';
import { UserUpdateButton } from '.';

const meta = {
  title: 'Buttons/UserUpdateButton',
  component: UserUpdateButton,
};

export default meta;

const Template = args => <UserUpdateButton {...args} />;

export const Renders = Template.bind({});

export const CanUpdate = Template.bind({});

CanUpdate.args = {
  canUpdate: { value: true },
};
