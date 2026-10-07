import {
  index,
  layout,
  route,
  type RouteConfig,
} from '@react-router/dev/routes';

/**
 * The routes follow the RealWorld frontend spec. src/root.tsx is the root
 * route. The pages layout shows page errors inside the navbar and footer.
 */
export default [
  layout('routes/pages.tsx', [
    index('routes/home.tsx'),
    // The same module as the index route, so it needs its own id.
    route('tag/:tag', 'routes/home.tsx', { id: 'routes/tag' }),
    route('article/:slug', 'routes/article.tsx'),
    route('profile/:username/:tab?', 'routes/profile.tsx'),
    route('logout', 'routes/logout.ts'),
    layout('routes/guest.tsx', [
      route('login', 'routes/login.tsx'),
      route('register', 'routes/register.tsx'),
    ]),
    layout('routes/signed-in.tsx', [
      route('settings', 'routes/settings.tsx'),
      route('editor', 'routes/new-article.tsx'),
      route('editor/:slug', 'routes/edit-article.tsx'),
      route('article/:slug/favorite', 'routes/article-favorite.ts'),
      route('article/:slug/comments', 'routes/article-comments.ts'),
      route('article/:slug/comments/:id', 'routes/article-comment.ts'),
      route('profile/:username/follow', 'routes/profile-follow.ts'),
    ]),
    route('*', 'routes/not-found.tsx'),
  ]),
] satisfies RouteConfig;
