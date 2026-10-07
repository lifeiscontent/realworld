import { expect } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { article } from '../../stories/fixtures';
import { ArticleAuthorActions, ArticleReaderActions } from './ArticleActions';
import { ArticleMeta } from './ArticleMeta';

const meta = preview.meta({
  title: 'Features/Article/ArticleMeta',
  component: ArticleMeta,
  tags: ['autodocs'],
  args: { article },
});

/** The author and the date, without actions. */
export const Default = meta.story({
  play: async ({ canvas }) => {
    // The avatar and the name both link to the profile.
    for (const link of canvas.getAllByRole('link', { name: 'anah' })) {
      await expect(link).toHaveAttribute('href', '/profile/anah');
    }
    await expect(canvas.queryByRole('button')).toBeNull();
  },
});

/** Other users can follow the author and favorite the article. */
export const Reader = meta.story({
  args: { children: <ArticleReaderActions article={article} /> },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /Follow anah/ })
    ).toHaveAttribute('aria-pressed', 'false');
    await expect(
      canvas.getByRole('button', { name: /Favorite Article/ })
    ).toHaveAttribute('aria-pressed', 'false');
  },
});

/** The author can edit and delete the article. */
export const Author = meta.story({
  args: { children: <ArticleAuthorActions slug={article.slug} /> },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('link', { name: /Edit Article/ })
    ).toHaveAttribute('href', `/editor/${article.slug}`);
    await expect(
      canvas.getByRole('button', { name: /Delete Article/ })
    ).toBeVisible();
  },
});
