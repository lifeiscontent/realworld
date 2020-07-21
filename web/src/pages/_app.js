import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apolloClient';

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

App.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.shape({
    initialApolloState: PropTypes.object,
  }),
};
