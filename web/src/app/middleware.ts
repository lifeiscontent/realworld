import { createContext, redirect, type MiddlewareFunction } from 'react-router';
import type { Viewer_UserFragment } from '../types/__generated__/graphql';
import { apolloClientContext } from './context';
import { getToken } from './session';
import { VIEWER_QUERY } from './viewer';

/** The signed-in user, or null. viewerMiddleware sets it for each request. */
export const viewerContext = createContext<Viewer_UserFragment | null>(null);

/**
 * Loads the viewer once for each navigation and fetcher call, so loaders and
 * actions read it from the context. The query uses the cache after the first
 * request.
 */
export const viewerMiddleware: MiddlewareFunction = async (
  { context },
  next
) => {
  if (getToken()) {
    const client = context.get(apolloClientContext);
    const { data } = await client.query({
      query: VIEWER_QUERY,
      errorPolicy: 'all',
    });
    context.set(viewerContext, data?.user ?? null);
  }
  return next();
};

/** Sends guests to the sign-in page. */
export const requireViewer: MiddlewareFunction = ({ context }, next) => {
  if (!context.get(viewerContext)) throw redirect('/login');
  return next();
};

/** Sends signed-in users away from the sign-in and sign-up pages. */
export const guestOnly: MiddlewareFunction = ({ context }, next) => {
  if (context.get(viewerContext)) throw redirect('/');
  return next();
};
