import { useEffect, type ReactNode } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from 'react-router';

import type { Route } from './+types/root';
import { viewerMiddleware } from './app/middleware';
import { getToken } from './app/session';
import { loadViewer, useViewer } from './app/viewer';
import { ErrorPage } from './layout/ErrorPage';
import { Footer } from './layout/Footer';
import { Navbar } from './layout/Navbar';
import { pageMeta } from './lib/meta';

import './app.css';

export { shouldRevalidate } from './app/revalidation';

export const links: Route.LinksFunction = () => [
  // The ion-* icons of the templates (Ionicons v2).
  {
    rel: 'stylesheet',
    href: 'https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css',
  },
  // The fonts of the theme.
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700|Lora:400,700',
  },
  // The shared Conduit theme.
  { rel: 'stylesheet', href: '/styles.css' },
];

/** The HTML document around the app. */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="The mother of all demo apps" />
        <meta name="theme-color" content="#5cb85c" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const meta: Route.MetaFunction = ({ error }) =>
  pageMeta(undefined, error);

export const clientMiddleware = [viewerMiddleware];

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  return { viewerRef: await loadViewer(context) };
}

/** The layout of every page: the navbar, the page, and the footer. */
export default function Root() {
  const { viewer, authState } = useViewer();
  const navigation = useNavigation();
  const busy = navigation.state !== 'idle';

  // The RealWorld e2e tests read the session through window.__conduit_debug__.
  useEffect(() => {
    window.__conduit_debug__ = {
      getToken,
      getAuthState: () => authState,
      getCurrentUser: () => {
        const token = getToken();
        return viewer && token
          ? {
              username: viewer.username,
              email: viewer.email,
              bio: viewer.bio ?? null,
              image: viewer.image ?? null,
              token,
            }
          : null;
      },
    };
  }, [viewer, authState]);

  return (
    <>
      {busy && <div className="loading-bar" aria-hidden="true" />}
      <Navbar viewer={viewer} />
      <main aria-busy={busy}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

/** Shows while the root loader runs on the first load. */
export function HydrateFallback() {
  return <div className="loading-bar" aria-hidden="true" />;
}

/** An error in the root loader. The navbar is not available. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ErrorPage error={error} />;
}
