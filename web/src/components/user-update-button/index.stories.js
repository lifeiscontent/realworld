import { UserUpdateButton } from '.';
import { buildAuthorizationResult } from '../../utils/storybook';
import { within, expect } from '@storybook/test';

const meta = {
  component: UserUpdateButton,
};

export default meta;

export const AsGuest = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(canvas.queryByRole('link')).toBeNull();
  },
};

export const CanUpdate = {
  args: {
    canUpdate: buildAuthorizationResult({ value: true }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link');

    await expect(link).toHaveAttribute('href', '/settings');
  },
};
