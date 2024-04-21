import { within, expect } from '@storybook/test';
import { ArticleUpdateButton } from '.';
import { buildAuthorizationResult } from '../../utils/storybook';

const meta = {
  component: ArticleUpdateButton,
  args: {
    slug: 'a-simple-title',
  },
};

export default meta;

export const AsGuest = {
  play: async ({ canvasElement }) => {
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

    await expect(link).toHaveAttribute('href', '/editor/a-simple-title');
  },
};
