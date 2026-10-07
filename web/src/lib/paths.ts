/** The URLs of the app. Each one encodes its parameters. */
export const paths = {
  home: () => '/',
  tag: (tag: string) => `/tag/${encodeURIComponent(tag)}`,
  article: (slug: string) => `/article/${encodeURIComponent(slug)}`,
  articleFavorite: (slug: string) => `${paths.article(slug)}/favorite`,
  articleComments: (slug: string) => `${paths.article(slug)}/comments`,
  articleComment: (slug: string, id: string) =>
    `${paths.articleComments(slug)}/${encodeURIComponent(id)}`,
  profile: (username: string) => `/profile/${encodeURIComponent(username)}`,
  profileFavorites: (username: string) =>
    `${paths.profile(username)}/favorites`,
  profileFollow: (username: string) => `${paths.profile(username)}/follow`,
  editor: (slug?: string) =>
    slug ? `/editor/${encodeURIComponent(slug)}` : '/editor',
  login: () => '/login',
  register: () => '/register',
  settings: () => '/settings',
  logout: () => '/logout',
};
