import { expect } from 'storybook/test';
import preview from '../../.storybook/preview';
import { article } from '../stories/fixtures';
import { ArticleMeta } from './ArticleMeta';

const meta = preview.meta({
  title: 'Components/ArticleMeta',
  component: ArticleMeta,
  tags: ['autodocs'],
  args: { article, isAuthor: false },
});

/** Other users can follow the author and favorite the article. */
export const Reader = meta.story({
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /Follow anah/ })
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: /Favorite Article/ })
    ).toHaveAttribute('aria-pressed', 'false');
  },
});

/** The author can edit and delete the article. */
export const Author = meta.story({
  args: { isAuthor: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('link', { name: /Edit Article/ })
    ).toHaveAttribute('href', `/editor/${article.slug}`);
    await expect(
      canvas.getByRole('button', { name: /Delete Article/ })
    ).toBeVisible();
  },
});
