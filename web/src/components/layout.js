import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from './navbar';
import Link from 'next/link';
import gql from 'graphql-tag';

export function Layout(props) {
  return (
    <>
      <Navbar userUsername={props.userUsername} />
      {props.children}
      <footer>
        <div className="container">
          <Link href="/" as="/">
            <a className="logo-font">conduit</a>
          </Link>
          <span className="attribution">
            An interactive learning project from{' '}
            <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
            licensed under MIT.
          </span>
        </div>
      </footer>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  userUsername: PropTypes.string
};
