import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { article, author } from '../stories/fixtures';
import { PROFILE_PAGE_QUERY } from './profile';

const meta = preview.meta({
  title: 'Pages/Profile',
  parameters: { router: { app: true, url: `/profile/${author.username}` } },
});

const profileMock = (favorites: boolean, data: object) => ({
  request: {
    query: PROFILE_PAGE_QUERY,
    variables: {
      username: author.username,
      author: favorites ? undefined : author.username,
      favorited: favorites ? author.username : undefined,
      limit: 10,
      offset: 0,
    },
  },
  result: { data },
});

const articles = {
  __typename: 'MultipleArticles' as const,
  articles: [article],
  articlesCount: 1,
};

/** The articles of the user. A guest can follow the user. */
export const MyArticles = meta.story({
  parameters: {
    apolloClient: {
      mocks: [profileMock(false, { profile: author, articles })],
    },
  },
  play: async ({ canvas }) => {
    await canvas.findByRole('heading', { name: author.username });
    await expect(canvas.getByRole('link', { name: 'My Articles' })).toHaveClass(
      'active'
    );
    await expect(
      canvas.getByRole('button', { name: /Follow anah/ })
    ).toBeVisible();
  },
});

/** The articles that the user favorited. */
export const FavoritedArticles = meta.story({
  parameters: {
    router: { app: true, url: `/profile/${author.username}/favorites` },
    apolloClient: { mocks: [profileMock(true, { profile: author, articles })] },
  },
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByRole('link', { name: 'Favorited Articles' })
    ).toHaveClass('active');
  },
});

/** An unknown username is a 404. */
export const NotFound = meta.story({
  parameters: {
    apolloClient: {
      mocks: [
        profileMock(false, {
          profile: null,
          articles: { ...articles, articles: [], articlesCount: 0 },
        }),
      ],
    },
  },
  play: async ({ canvas }) => {
    await canvas.findByText('This profile does not exist.');
  },
});

/** Only "favorites" is a profile tab. */
export const UnknownTab = meta.story({
  parameters: {
    router: { app: true, url: `/profile/${author.username}/other` },
  },
  play: async ({ canvas }) => {
    await canvas.findByRole('heading', { name: '404 Not Found' });
  },
});
