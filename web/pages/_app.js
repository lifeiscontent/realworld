import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import withApollo from '../lib/with-apollo';
import { Navbar } from '../containers';
import NextApp from 'next/app';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Conduit</title>
        <meta charSet="utf-8" />
        <link
          href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="stylesheet" href="//demo.productionready.io/main.css" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
      <footer>
        <div className="container">
          <Link href="/" as="/" shallow>
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

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired
};

App.getInitialProps = async appContext => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await NextApp.getInitialProps(appContext);

  return { ...appProps };
};

export default withApollo(App);
