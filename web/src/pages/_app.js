import PropTypes from 'prop-types';
import { ApolloProvider } from '@apollo/client';
import { useApollo, APOLLO_STATE_PROP_NAME } from '../lib/apolloClient';

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

App.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.shape({
    [APOLLO_STATE_PROP_NAME]: PropTypes.object,
  }),
};
