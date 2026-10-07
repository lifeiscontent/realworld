import { type ActionFunctionArgs, href, redirect } from 'react-router';

import { apolloClientContext } from '../app/context';
import { endSession } from '../app/viewer';
import { actionOnlyLoader, methodNotAllowed } from '../lib/responses';

export const loader = actionOnlyLoader;

/** POST /logout ends the session and opens the home page. */
export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== 'POST') throw methodNotAllowed();
  await endSession(context.get(apolloClientContext));
  return redirect(href('/'));
}
