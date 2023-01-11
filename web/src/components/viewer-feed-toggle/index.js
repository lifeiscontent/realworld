import PropTypes from 'prop-types';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';

export function ViewerFeedToggle({ username }) {
  const router = useRouter();
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          {username ? (
            <Link
              href="/feed"
              className={clsx('nav-link', {
                active: router.route === '/feed',
              })}
            >
              Your Feed
            </Link>
          ) : (
            <span className="nav-link disabled">Your Feed</span>
          )}
        </li>
        <li className="nav-item">
          <Link
            href="/"
            className={clsx('nav-link', { active: router.route === '/' })}
          >
            Global Feed
          </Link>
        </li>
        {router.query.tagName && (
          <li className="nav-item">
            <Link href={router.asPath} className="nav-link active">
              #{router.query.tagName}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

ViewerFeedToggle.fragments = {
  viewer: gql`
    fragment ViewerFeedToggleViewerFragment on User {
      username
    }
  `,
};

ViewerFeedToggle.propTypes = {
  username: PropTypes.string,
};
