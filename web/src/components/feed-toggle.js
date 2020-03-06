import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import clsx from 'clsx';

export function FeedToggle(props) {
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          {props.userUsername ? (
            <Link href="/feed" as="/feed">
              <a
                className={clsx('nav-link', {
                  active: props.pathname === '/feed'
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
            <a className={clsx('nav-link', { active: props.pathname === '/' })}>
              Global Feed
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
}

FeedToggle.propTypes = {
  userUsername: PropTypes.string,
  pathname: PropTypes.string.isRequired
};
