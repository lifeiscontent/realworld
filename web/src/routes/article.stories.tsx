import { expect, waitFor } from 'storybook/test';

import preview from '../../.storybook/preview';
import {
  article,
  comment,
  ownArticle,
  signIn,
  viewer,
  viewerMock,
} from '../stories/fixtures';
import { ARTICLE_PAGE_QUERY } from './article';
import { ADD_COMMENT_MUTATION } from './article-comments';

const meta = preview.meta({
  title: 'Pages/Article',
  parameters: { router: { app: true, url: `/article/${article.slug}` } },
});

const articleMock = (data: object) => ({
  request: { query: ARTICLE_PAGE_QUERY, variables: { slug: article.slug } },
  result: { data },
});

/** A guest reads the article and its comments. */
export const Default = meta.story({
  parameters: {
    apolloClient: { mocks: [articleMock({ article, comments: [comment] })] },
  },
  play: async ({ canvas }) => {
    await canvas.findByRole('heading', { name: article.title });
    await canvas.findByText(comment.body);
    await expect(
      canvas.getByText(/to add comments on this article/)
    ).toBeVisible();
  },
});

/** The author can edit and delete the article. */
export const Author = meta.story({
  beforeEach: signIn,
  parameters: {
    apolloClient: {
      mocks: [viewerMock, articleMock({ article: ownArticle, comments: [] })],
    },
  },
  play: async ({ canvas }) => {
    await expect(
      await canvas.findAllByRole('link', { name: /Edit Article/ })
    ).toHaveLength(2);
    await expect(
      canvas.getAllByRole('button', { name: /Delete Article/ })
    ).toHaveLength(2);
  },
});

/** A new comment shows at the top of the list from the cache. */
export const AddComment = meta.story({
  beforeEach: signIn,
  parameters: {
    apolloClient: {
      mocks: [
        viewerMock,
        articleMock({ article, comments: [comment] }),
        {
          request: {
            query: ADD_COMMENT_MUTATION,
            variables: { slug: article.slug, comment: { body: 'Nice!' } },
          },
          result: {
            data: {
              addComment: {
                ...comment,
                id: '2',
                body: 'Nice!',
                author: { ...comment.author, username: viewer.username },
              },
            },
          },
        },
      ],
    },
  },
  play: async ({ canvas, userEvent }) => {
    const textbox = await canvas.findByRole('textbox', {
      name: 'Write a comment...',
    });
    await userEvent.type(textbox, 'Nice!');
    await userEvent.click(canvas.getByRole('button', { name: 'Post Comment' }));
    await canvas.findByText('Nice!', { selector: '.card-text' });
    await waitFor(() => expect(textbox).toHaveValue(''));
  },
});

/** The loader responds with 404 for an unknown slug. */
export const NotFound = meta.story({
  parameters: {
    apolloClient: { mocks: [articleMock({ article: null, comments: null })] },
  },
  play: async ({ canvas }) => {
    await canvas.findByRole('heading', { name: '404 Not Found' });
    await expect(
      canvas.getByText('This article does not exist.')
    ).toBeVisible();
  },
});
