import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import gql from 'graphql-tag';

export function FeedToggle(props) {
  const router = useRouter();

  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          {props.userId ? (
            <Link href="/feed" as="/feed">
              <a
                className={clsx('nav-link', {
                  active: router.pathname === '/feed'
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
          <Link href="/" as="/">
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

FeedToggle.propTypes = {
  userId: PropTypes.string
};

FeedToggle.fragments = {
  user: gql`
    fragment FeedToggleUserFragment on User {
      id
    }
  `
};
