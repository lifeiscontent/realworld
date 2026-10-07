import { expect } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { article } from '../../stories/fixtures';
import { ArticleForm } from './ArticleForm';

const meta = preview.meta({
  title: 'Features/Article/ArticleForm',
  component: ArticleForm,
  tags: ['autodocs'],
});

/** Enter adds a tag, and the icon removes it. */
export const NewArticle = meta.story({
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Enter tags' }),
      'dragons{Enter}'
    );
    const remove = canvas.getByRole('button', { name: 'Remove tag dragons' });
    await userEvent.click(remove);
    await expect(remove).not.toBeInTheDocument();
  },
});

/** The editor shows the current article. */
export const EditArticle = meta.story({
  args: { defaultValues: article },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'Article Title' })
    ).toHaveValue(article.title);
    await expect(
      canvas.getByRole('button', { name: 'Remove tag training' })
    ).toBeVisible();
  },
});
