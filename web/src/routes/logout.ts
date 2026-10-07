import { href, redirect } from 'react-router';

import { apolloClientContext } from '../app/context';
import { endSession } from '../app/viewer';
import { actionOnlyLoader, methodNotAllowed } from '../lib/responses';
import type { Route } from './+types/logout';

export const clientLoader = actionOnlyLoader;

/** POST /logout ends the session and opens the home page. */
export async function clientAction({
  request,
  context,
}: Route.ClientActionArgs) {
  if (request.method !== 'POST') throw methodNotAllowed();
  await endSession(context.get(apolloClientContext));
  return redirect(href('/'));
}
