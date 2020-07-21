import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';

export function UserArticlesToggle({ username }) {
  const router = useRouter();
  return (
    <div className="articles-toggle">
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link href="/user/[username]" as={`/user/${username}`}>
            <a
              className={clsx('nav-link', {
                active: router.pathname === '/user/[username]',
              })}
            >
              My Articles
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            href="/user/[username]/favorites"
            as={`/user/${username}/favorites`}
          >
            <a
              className={clsx('nav-link', {
                active: router.pathname === '/[username]/favorites',
              })}
            >
              Favorited Articles
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
}

UserArticlesToggle.fragments = {
  user: gql`
    fragment UserArticlesToggleUserFragment on User {
      username
    }
  `,
};

UserArticlesToggle.propTypes = {
  username: PropTypes.string.isRequired,
};
