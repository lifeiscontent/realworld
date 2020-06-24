import { useMemo } from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import cacheConfig from '../apollo/cache-config';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import cookie from 'cookie';

let apolloClient;

function createApolloClient(ctx) {
  const ssrMode = typeof window === 'undefined';
  return new ApolloClient({
    assumeImmutableResults: true,
    connectToDevTools: !ssrMode && process.env.NODE_ENV !== 'production',
    ssrMode,
    name: 'Condit',
    version: '1.0.0',
    link: ApolloLink.from([
      setContext(() => {
        const { authorization } = ssrMode
          ? cookie.parse(ctx?.req?.headers?.cookie ?? '')
          : cookie.parse(document.cookie);
        return {
          headers: { authorization },
        };
      }),
      new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URL, // Server URL (must be absolute)
        credentials: 'omit', // Additional fetch() options like `credentials` or `headers`
      }),
    ]),
    cache: new InMemoryCache(cacheConfig),
  });
}

export function initializeApollo(ctx, initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient(ctx);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(undefined, initialState), [
    initialState,
  ]);
  return store;
}
