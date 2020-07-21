import { useMemo } from 'react';
import { ApolloClient, HttpLink, ApolloLink } from '@apollo/client';
import { InMemoryCache, defaultDataIdFromObject } from '@apollo/client/cache';
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from '@apollo/client/utilities';
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
    cache: new InMemoryCache({
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
        },
        User: {
          keyFields: ['username'],
        },
        Query: {
          fields: {
            articlesConnection: relayStylePagination(),
            articleBySlug(_, { args, toReference }) {
              return toReference({ __typename: 'Article', slug: args.slug });
            },
            comment(_, { args, toReference }) {
              return toReference({ __typename: 'Comment', id: args.id });
            },
            feedConnection: relayStylePagination(),
            userByUsername(_, { args, toReference }) {
              return toReference({
                __typename: 'User',
                username: args.username,
              });
            },
            tag(_, { args, toReference }) {
              return toReference({ __typename: 'Tag', id: args.id });
            },
          },
        },
      },
    }),
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
