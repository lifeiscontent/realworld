import { clearToken, setToken } from '../app/session';
import { VIEWER_QUERY } from '../app/viewer';

/**
 * Data for stories. The objects have all fields that the queries select, so
 * one object fits each query.
 */
export const viewer = {
  __typename: 'User' as const,
  email: 'jake@jake.jake',
  username: 'jake',
  bio: 'I work at statefarm',
  image: null,
};

export const author = {
  __typename: 'Profile' as const,
  username: 'anah',
  bio: 'I like dragons',
  image: null,
  following: false,
};

export const article = {
  __typename: 'Article' as const,
  slug: 'how-to-train-your-dragon',
  title: 'How to train your dragon',
  description: 'Ever wonder how?',
  body: 'It takes a **Jacobian**.',
  tagList: ['dragons', 'training'],
  createdAt: '2026-02-18T03:22:56.637Z',
  updatedAt: '2026-02-18T03:48:35.824Z',
  favorited: false,
  favoritesCount: 3,
  author,
};

/** The same article, written by the viewer. */
export const ownArticle = {
  ...article,
  author: { ...author, username: viewer.username, bio: viewer.bio },
};

export const comment = {
  __typename: 'Comment' as const,
  id: '1',
  body: 'It takes a Jacobian',
  createdAt: '2026-02-18T03:22:56.637Z',
  updatedAt: '2026-02-18T03:22:56.637Z',
  author,
};

export const tags = ['dragons', 'training', 'welcome'];

/** The mock of the Viewer query for a signed-in story. */
export const viewerMock = {
  request: { query: VIEWER_QUERY },
  result: { data: { user: viewer } },
};

/**
 * Signs in for one story: the token goes into localStorage before the story
 * renders, and comes out after it. Add viewerMock to the mocks too.
 */
export function signIn() {
  setToken('story-token');
  return clearToken;
}
