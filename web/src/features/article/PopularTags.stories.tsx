import { expect } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { tags } from '../../stories/fixtures';
import { PopularTags } from './PopularTags';

const meta = preview.meta({
  title: 'Features/Article/PopularTags',
  component: PopularTags,
  tags: ['autodocs'],
  args: { tags },
});

export const Default = meta.story({
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'dragons' })).toHaveAttribute(
      'href',
      '/tag/dragons'
    );
  },
});

export const Empty = meta.story({
  args: { tags: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No tags are here... yet.')).toBeVisible();
  },
});
