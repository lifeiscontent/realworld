import { href, Link } from 'react-router';

import { describeRouteError } from '../lib/meta';

/** The page for a route error, for example a 404. */
export function ErrorPage({ error }: { error: unknown }) {
  const { title, message } = describeRouteError(error);
  return (
    <div className="container page">
      <h1>{title}</h1>
      {message && <p>{message}</p>}
      <p>
        <Link to={href('/')}>Go to the home page</Link>
      </p>
    </div>
  );
}
