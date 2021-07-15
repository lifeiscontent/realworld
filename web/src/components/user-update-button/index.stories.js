import React from 'react';
import { UserUpdateButton } from '.';

export default {
  title: 'Buttons/UserUpdateButton',
  component: UserUpdateButton,
};

export const renders = () => <UserUpdateButton />;

export const canUpdate = () => <UserUpdateButton canUpdate={{ value: true }} />;
