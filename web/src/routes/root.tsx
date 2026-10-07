import { useEffect } from 'react';
import {
  href,
  isRouteErrorResponse,
  Link,
  type LoaderFunctionArgs,
  Outlet,
  useNavigation,
  useRouteError,
} from 'react-router';

import { viewerMiddleware } from '../app/middleware';
import { getToken } from '../app/session';
import { loadViewer, type RootLoaderData, useViewer } from '../app/viewer';
import { Footer } from '../layout/Footer';
import { Navbar } from '../layout/Navbar';

export { shouldRevalidate } from '../app/revalidation';

export const middleware = [viewerMiddleware];

export async function loader({
  context,
}: LoaderFunctionArgs): Promise<RootLoaderData> {
  return { viewerRef: await loadViewer(context) };
}

/** The layout of every page: the navbar, the page, and the footer. */
export function Component() {
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
      <title>Conduit</title>
      {busy && <div className="loading-bar" aria-hidden="true" />}
      <Navbar viewer={viewer} />
      <main aria-busy={busy}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export function HydrateFallback() {
  return null;
}

/** The message for a route error: the 404 text, or a general message. */
function describe(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return {
      title: `${error.status} ${error.statusText}`.trim(),
      message: typeof error.data === 'string' ? error.data : undefined,
    };
  }
  return { title: 'Something went wrong', message: 'Try again later.' };
}

function ErrorPage() {
  const { title, message } = describe(useRouteError());
  return (
    <div className="container page">
      <title>{`${title} | Conduit`}</title>
      <h1>{title}</h1>
      {message && <p>{message}</p>}
      <p>
        <Link to={href('/')}>Go to the home page</Link>
      </p>
    </div>
  );
}

/**
 * Errors of a page show in the layout, so the navbar stays. The pathless
 * route in src/app/router.tsx uses this boundary.
 */
export const PageErrorBoundary = ErrorPage;

/** An error in the root loader. The layout is not available. */
export const ErrorBoundary = ErrorPage;
