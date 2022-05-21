import { expect } from '@storybook/jest';
import { within, waitFor } from '@storybook/testing-library';
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
    const elements = canvas.queryAllByRole('link');

    await waitFor(() => expect(elements).toHaveLength(0));
  },
};

export const CanUpdate = {
  args: {
    canUpdate: buildAuthorizationResult({ value: true }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link');

    await waitFor(() =>
      expect(link).toHaveAttribute('href', '/editor/a-simple-title')
    );
  },
};
