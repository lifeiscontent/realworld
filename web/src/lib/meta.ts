import { isRouteErrorResponse } from 'react-router';

/** The title and the message for a route error, for example a 404. */
export function describeRouteError(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return {
      title: `${error.status} ${error.statusText}`.trim(),
      message: typeof error.data === 'string' ? error.data : undefined,
    };
  }
  return { title: 'Something went wrong', message: 'Try again later.' };
}

/**
 * The meta tags of a page: its title, or the title of its error. Use it in
 * the meta export of a route.
 */
export function pageMeta(title: string | undefined, error?: unknown) {
  const text = error ? describeRouteError(error).title : title;
  return [{ title: text ? `${text} | Conduit` : 'Conduit' }];
}
