import PropTypes from 'prop-types';
import { Footer } from '../../components/footer';
import { Navbar } from '../../components/navbar';
import { gql } from '@apollo/client';
import Head from 'next/head';

export function Layout({ children, username }) {
  return (
    <>
      <Head>
        <title>Conduit</title>
        <meta charSet="utf-8" />
        <meta name="Description" content="The mother of all demo apps" />
        <meta name="theme-color" content="#5cb85c" />
      </Head>
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
  `,
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  username: PropTypes.string,
};
