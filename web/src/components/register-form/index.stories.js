import { fn } from 'storybook/test';
import { RegisterForm } from '.';

const meta = {
  args: {
    onSubmit: fn(),
  },
  component: RegisterForm,
};

export default meta;

export const AsGuest = {};
