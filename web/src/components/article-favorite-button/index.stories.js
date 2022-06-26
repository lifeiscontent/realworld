import { expect } from '@storybook/jest';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { ArticleFavoriteButton } from '.';
import { buildAuthorizationResult } from '../../utils/storybook';

const meta = {
  component: ArticleFavoriteButton,
  args: {
    slug: 'a-simple-title',
  },
  argTypes: {
    onFavorite: { action: true },
    onUnfavorite: { action: true },
  },
};

export default meta;

export const AsGuest = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button'));

    await waitFor(() => expect(args.onFavorite).not.toHaveBeenCalled());
  },
};

export const AsUserWhoHasNotFavorited = {
  args: {
    canFavorite: buildAuthorizationResult({ value: true }),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button'));

    await waitFor(() => expect(args.onFavorite).toHaveBeenCalled());
  },
};

export const AsUserWhoHasFavorited = {
  args: {
    canUnfavorite: buildAuthorizationResult({ value: true }),
    favoritesCount: 1,
    viewerDidFavorite: buildAuthorizationResult({ value: true }),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button'));

    await waitFor(() => expect(args.onUnfavorite).toHaveBeenCalled());
  },
};
