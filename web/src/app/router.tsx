import type { RouteObject } from 'react-router';
import * as root from '../routes/root';
import { guestOnly, requireViewer } from './middleware';

/**
 * The routes follow the RealWorld frontend spec. Pages load their data in
 * loaders, and forms post to actions. Middleware cannot load lazily, so the
 * groups that need a guest or a signed-in user are pathless parents.
 */
export const routes: RouteObject[] = [
  {
    id: 'root',
    path: '/',
    ...root,
    children: [
      {
        // Errors of a page show inside the layout of the root route.
        ErrorBoundary: root.PageErrorBoundary,
        children: [
          { index: true, lazy: () => import('../routes/home') },
          { path: 'tag/:tag', lazy: () => import('../routes/home') },
          { path: 'article/:slug', lazy: () => import('../routes/article') },
          {
            path: 'profile/:username/:tab?',
            lazy: () => import('../routes/profile'),
          },
          { path: 'logout', lazy: () => import('../routes/logout') },
          {
            middleware: [guestOnly],
            children: [
              { path: 'login', lazy: () => import('../routes/login') },
              { path: 'register', lazy: () => import('../routes/register') },
            ],
          },
          {
            middleware: [requireViewer],
            children: [
              { path: 'settings', lazy: () => import('../routes/settings') },
              { path: 'editor/:slug?', lazy: () => import('../routes/editor') },
              {
                path: 'article/:slug/favorite',
                lazy: () => import('../routes/article-favorite'),
              },
              {
                path: 'article/:slug/comments',
                lazy: () => import('../routes/article-comments'),
              },
              {
                path: 'article/:slug/comments/:id',
                lazy: () => import('../routes/article-comment'),
              },
              {
                path: 'profile/:username/follow',
                lazy: () => import('../routes/profile-follow'),
              },
            ],
          },
          { path: '*', lazy: () => import('../routes/not-found') },
        ],
      },
    ],
  },
];
