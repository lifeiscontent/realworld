import React from 'react';
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
            <Link href="/feed">
              <a
                className={clsx('nav-link', {
                  active: router.pathname === '/feed',
                })}
              >
                Your Feed
              </a>
            </Link>
          ) : (
            <span className="nav-link disabled">Your Feed</span>
          )}
        </li>
        <li className="nav-item">
          <Link href="/">
            <a
              className={clsx('nav-link', { active: router.pathname === '/' })}
            >
              Global Feed
            </a>
          </Link>
        </li>
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
