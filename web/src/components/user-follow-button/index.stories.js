import { expect, userEvent, within } from '@storybook/test';
import { UserFollowButton } from '.';
import { buildAuthorizationResult } from '../../utils/storybook';

const meta = {
  component: UserFollowButton,
  args: {
    username: 'lifeiscontent',
  },
  argTypes: {
    onFollow: { action: true },
    onUnfollow: { action: true },
  },
};

export default meta;

export const AsGuest = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button')).toBeDisabled();
  },
};

export const CanFollow = {
  args: {
    canFollow: buildAuthorizationResult({ value: true }),
  },
  async play({ args, canvasElement }) {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await expect(button).not.toBeDisabled();

    await userEvent.click(button);

    await expect(args.onFollow).toHaveBeenCalled();
  },
};

export const CanUnfollow = {
  args: {
    canUnfollow: buildAuthorizationResult({ value: true }),
    followersCount: 1,
    viewerIsFollowing: true,
  },
  async play({ args, canvasElement }) {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await expect(button).not.toBeDisabled();

    await userEvent.click(button);

    await expect(args.onUnfollow).toHaveBeenCalled();
  },
};
