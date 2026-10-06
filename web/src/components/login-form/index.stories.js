import { fn } from 'storybook/test';
import { LoginForm } from '.';

const meta = {
  args: {
    onSubmit: fn(),
  },
  component: LoginForm,
};

export default meta;

export const AsGuest = {};
