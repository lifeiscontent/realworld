import type { Params } from 'react-router';

import { notFound } from './responses';

/** Reads a route parameter. A missing parameter is a 404. */
export function requireParam(params: Params, name: string): string {
  const value = params[name];
  if (!value) throw notFound('This page does not exist.');
  return value;
}
