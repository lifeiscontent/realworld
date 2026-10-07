import { pageMeta } from '../lib/meta';
import { notFound } from '../lib/responses';
import type { Route } from './+types/not-found';

/** Any URL that no other route matches. */
export function clientLoader(): never {
  throw notFound('This page does not exist.');
}

export const meta: Route.MetaFunction = ({ error }) =>
  pageMeta(undefined, error);
