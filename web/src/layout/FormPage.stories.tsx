import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { ArticleForm } from '../features/article/ArticleForm';
import { LoginForm } from '../features/auth/LoginForm';
import { FormPage } from './FormPage';

const meta = preview.meta({
  title: 'Layout/FormPage',
  component: FormPage,
  tags: ['autodocs'],
  args: {
    page: 'auth-page' as const,
    width: 'narrow' as const,
    children: <LoginForm />,
  },
});

/** A narrow column for account forms. */
export const Narrow = meta.story({
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('.auth-page .col-md-6')
    ).not.toBeNull();
  },
});

/** A wide column for the editor. */
export const Wide = meta.story({
  args: { page: 'editor-page', width: 'wide', children: <ArticleForm /> },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('.editor-page .col-md-10')
    ).not.toBeNull();
  },
});
