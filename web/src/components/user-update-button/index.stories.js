import React from 'react';
import { UserUpdateButton } from '.';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'Buttons/UserUpdateButton',
  component: UserUpdateButton,
  decorators: [withNextRouter],
};

export const renders = () => <UserUpdateButton />;

export const canUpdate = () => <UserUpdateButton canUpdate={{ value: true }} />;
