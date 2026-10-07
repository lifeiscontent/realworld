import type { ShouldRevalidateFunction } from 'react-router';

// Actions that update the cache themselves: favorite, follow, and comments.
const cacheActions = /\/(favorite|follow|comments(\/[^/]+)?)$/;

/**
 * Some actions change only cached entities, and the page reads them from the
 * cache. These actions do not load the page again. Other actions, for
 * example a new article, load the page again.
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formAction,
  defaultShouldRevalidate,
}) =>
  formAction && cacheActions.test(formAction) ? false : defaultShouldRevalidate;
