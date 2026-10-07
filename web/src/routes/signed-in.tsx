import { Outlet } from 'react-router';

import { requireViewer } from '../app/middleware';
import { useViewer } from '../app/viewer';

/** The layout of the pages and actions that need a signed-in user. */
export const middleware = [requireViewer];

/**
 * Gives the user to the pages below it (see useSignedInViewer). After logout
 * the viewer is null until the redirect ends, so nothing renders then.
 */
export function Component() {
  const { viewer } = useViewer();
  if (!viewer) return null;
  return <Outlet context={viewer} />;
}
