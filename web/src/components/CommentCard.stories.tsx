import { expect } from 'storybook/test';
import preview from '../../.storybook/preview';
import { article, comment } from '../stories/fixtures';
import { CommentCard } from './CommentCard';

const meta = preview.meta({
  title: 'Components/CommentCard',
  component: CommentCard,
  tags: ['autodocs'],
  args: { slug: article.slug, comment, canDelete: false },
});

export const Default = meta.story({
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByRole('button', { name: 'Delete comment' })
    ).toBeNull();
  },
});

/** The author of the comment can delete it. */
export const Deletable = meta.story({
  args: { canDelete: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Delete comment' })
    ).toBeVisible();
  },
});
