import React from 'react';
import PropTypes from 'prop-types';
import { Footer } from '../footer';
import { Navbar } from '../navbar';
import gql from 'graphql-tag';

export function Layout({ username, children }) {
  return (
    <>
      <Navbar username={username} />
      {children}
      <Footer />
    </>
  );
}

Layout.fragments = {
  viewer: gql`
    fragment LayoutViewerFragment on User {
      username
    }
  `
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  username: PropTypes.string
};
