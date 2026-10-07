import { Outlet } from 'react-router';

import { ErrorPage } from '../layout/ErrorPage';
import { pageMeta } from '../lib/meta';
import type { Route } from './+types/pages';

/** The parent of all pages. Its error boundary keeps the navbar on errors. */
export default function Pages() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ErrorPage error={error} />;
}

export const meta: Route.MetaFunction = ({ error }) =>
  pageMeta(undefined, error);
