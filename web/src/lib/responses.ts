import { data } from 'react-router';

/** Throw this from a loader when a record does not exist. */
export function notFound(message: string) {
  return data(message, { status: 404, statusText: 'Not Found' });
}

/** Throw this when a route does not accept the request method. */
export function methodNotAllowed() {
  return data('This page does not exist.', {
    status: 405,
    statusText: 'Method Not Allowed',
  });
}

/**
 * The loader of a route that only has an action, for example
 * /article/:slug/favorite. A GET request to it is an error.
 */
export function actionOnlyLoader(): never {
  throw methodNotAllowed();
}
