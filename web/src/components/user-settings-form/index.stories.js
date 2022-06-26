import { UserSettingsForm } from '.';

const meta = {
  component: UserSettingsForm,
  args: {
    email: 'john@example.com',
    username: 'john',
  },
  argTypes: {
    onSubmit: { action: true },
  },
};

export default meta;

export const AsGuest = {};
