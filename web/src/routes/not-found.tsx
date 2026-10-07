import { notFound } from '../lib/responses';

/** Any URL that no other route matches. */
export function loader(): never {
  throw notFound('This page does not exist.');
}
