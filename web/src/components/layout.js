import React from 'react';
import PropTypes from 'prop-types';
import { Footer } from './footer';
import { Navbar } from './navbar';

export function Layout({ userUsername, children }) {
  return (
    <>
      <Navbar userUsername={userUsername} />
      {children}
      <Footer />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  userUsername: PropTypes.string
};
