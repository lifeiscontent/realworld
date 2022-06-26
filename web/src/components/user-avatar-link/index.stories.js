import { expect } from '@storybook/jest';
import { waitFor, within } from '@storybook/testing-library';
import { UserAvatarLink } from '.';

const meta = {
  component: UserAvatarLink,
  args: {
    size: 32,
    profile: {
      imageUrl: undefined,
    },
    username: 'lifeiscontent',
  },
};

export default meta;

export const AsGuest = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', {
      name: new RegExp('lifeiscontent', 'i'),
    });

    await waitFor(() =>
      expect(link).toHaveAttribute('href', '/user/lifeiscontent')
    );
  },
};
