import * as React from 'react';
import { ApolloClient, HttpLink, ApolloLink } from '@apollo/client';
import { InMemoryCache, defaultDataIdFromObject } from '@apollo/client/cache';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from '@apollo/client/utilities';
import cookie from 'cookie';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

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
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URL, // Server URL (must be absolute)
        credentials: 'omit', // Additional fetch() options like `credentials` or `headers`
      }),
    ]),
    cache: createCache(),
  });
}

export function createCache() {
  return new InMemoryCache({
    resultCaching: true,
    dataIdFromObject(object) {
      switch (object.__typename) {
        case 'Article':
          return `${object.__typename}:${object.slug}`;
        case 'User':
          return `${object.__typename}:${object.username}`;
        default:
          return defaultDataIdFromObject(object);
      }
    },
    typePolicies: {
      Article: {
        keyFields: ['slug'],
        fields: {
          comments: {
            merge(_existing, incoming = []) {
              return incoming;
            },
          },
        },
      },
      User: {
        keyFields: ['username'],
        fields: {
          profile: {
            merge: true,
          },
        },
      },
      Query: {
        fields: {
          articlesConnection: relayStylePagination([
            'after',
            'before',
            'first',
            'last',
            'tagName',
          ]),
          articleBySlug: {
            read(_, { args, toReference }) {
              return toReference({ __typename: 'Article', slug: args.slug });
            },
          },
          comment: {
            read(_, { args, toReference }) {
              return toReference({ __typename: 'Comment', id: args.id });
            },
          },
          feedConnection: relayStylePagination([
            'after',
            'before',
            'first',
            'last',
            'tagName',
          ]),
          userByUsername: {
            read(_, { args, toReference }) {
              return toReference({
                __typename: 'User',
                username: args.username,
              });
            },
          },
          tag: {
            read(_, { args, toReference }) {
              return toReference({ __typename: 'Tag', id: args.id });
            },
          },
        },
      },
    },
  });
}

export function initializeApollo(ctx, initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient(ctx);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter(d => sourceArray.every(s => !isEqual(d, s))),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = React.useMemo(() => initializeApollo(state), [state]);
  return store;
}
