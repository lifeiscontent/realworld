import React from 'react';
import { UserUpdateButton } from '.';
import { withRouter } from '../../utils/storybook';

export default {
  title: 'Buttons/UserUpdateButton',
  component: UserUpdateButton,
  decorators: [withRouter]
};

export const renders = () => <UserUpdateButton />;

export const canUpdate = () => <UserUpdateButton canUpdate={{ value: true }} />;
