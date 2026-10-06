import { fn } from 'storybook/test';
import { UserSettingsForm } from '.';

const meta = {
  component: UserSettingsForm,
  args: {
    onSubmit: fn(),
    email: 'john@example.com',
    username: 'john',
  },
};

export default meta;

export const AsGuest = {};
