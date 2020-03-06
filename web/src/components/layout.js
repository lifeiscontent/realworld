import React from 'react';
import PropTypes from 'prop-types';
import { Footer } from './footer';
import { Navbar } from './navbar';

export function Layout(props) {
  return (
    <>
      <Navbar userUsername={props.userUsername} />
      {props.children}
      <Footer />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  userUsername: PropTypes.string
};
