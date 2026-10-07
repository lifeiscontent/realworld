import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { routes } from '../app/router';
import { article, signIn, tags, viewerMock } from '../stories/fixtures';
import { HOME_PAGE_QUERY } from './home';

const meta = preview.meta({
  title: 'Pages/Home',
  parameters: { router: { routes, url: '/' } },
});

/** The global feed with the popular tags. */
export const GlobalFeed = meta.story({
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: HOME_PAGE_QUERY,
            variables: { limit: 10, offset: 0, following: false },
          },
          result: {
            data: {
              articles: {
                __typename: 'MultipleArticles',
                articles: [article],
                articlesCount: 1,
              },
              tags,
            },
          },
        },
      ],
    },
  },
  play: async ({ canvas }) => {
    await canvas.findByRole('heading', { name: article.title });
    await expect(canvas.getByRole('link', { name: 'dragons' })).toBeVisible();
  },
});

/** The API has no articles yet. */
export const Empty = meta.story({
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: HOME_PAGE_QUERY,
            variables: { limit: 10, offset: 0, following: false },
          },
          result: {
            data: {
              articles: {
                __typename: 'MultipleArticles',
                articles: [],
                articlesCount: 0,
              },
              tags: [],
            },
          },
        },
      ],
    },
  },
  play: async ({ canvas }) => {
    await canvas.findByText('No articles are here... yet.');
  },
});

/** A signed-in user with an empty feed gets a link to the global feed. */
export const EmptyYourFeed = meta.story({
  beforeEach: signIn,
  parameters: {
    router: { routes, url: '/?feed=following' },
    apolloClient: {
      mocks: [
        viewerMock,
        {
          request: {
            query: HOME_PAGE_QUERY,
            variables: { limit: 10, offset: 0, following: true },
          },
          result: {
            data: {
              feed: {
                __typename: 'MultipleArticles',
                articles: [],
                articlesCount: 0,
              },
              tags,
            },
          },
        },
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByRole('link', { name: 'Your Feed' })
    ).toHaveClass('active');
    await expect(canvas.getByText(/Your feed is empty/)).toBeVisible();
  },
});

/** A guest who opens their feed goes to the sign-in page. */
export const YourFeedAsGuest = meta.story({
  parameters: { router: { routes, url: '/?feed=following' } },
  play: async ({ canvas }) => {
    await canvas.findByRole('heading', { name: 'Sign in' });
  },
});
