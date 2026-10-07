import {
  type ApolloCache,
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { getToken } from './session';

export function createCache() {
  return new InMemoryCache({
    typePolicies: {
      Article: { keyFields: ['slug'] },
      Profile: { keyFields: ['username'] },
      User: { keyFields: ['username'] },
      Query: {
        fields: {
          // A page can show an article or a profile from a list at once.
          // An entity that is not in the cache is missing, so the query
          // loads it.
          article: {
            read(existing, { args, toReference, canRead }) {
              if (existing === null) return null;
              const ref =
                existing ??
                toReference({ __typename: 'Article', slug: args?.slug });
              return canRead(ref) ? ref : undefined;
            },
          },
          profile: {
            read(existing, { args, toReference, canRead }) {
              if (existing === null) return null;
              const ref =
                existing ??
                toReference({
                  __typename: 'Profile',
                  username: args?.username,
                });
              return canRead(ref) ? ref : undefined;
            },
          },
        },
      },
    },
  });
}

export function createApolloClient(uri = import.meta.env.VITE_GRAPHQL_URL) {
  // The RealWorld API reads the token from "Authorization: Token <jwt>".
  const authLink = new SetContextLink(prevContext => {
    const token = getToken();
    return {
      headers: {
        ...prevContext.headers,
        ...(token ? { authorization: `Token ${token}` } : {}),
      },
    };
  });

  return new ApolloClient({
    link: ApolloLink.from([authLink, new HttpLink({ uri })]),
    cache: createCache(),
  });
}

/**
 * Removes the cached article lists, so the next page that shows a list loads
 * it again. Call it after an article is created, renamed, or deleted. It does
 * not update the current page, which is about to change.
 */
export function evictArticleLists(cache: ApolloCache) {
  for (const fieldName of ['articles', 'feed']) {
    cache.evict({ id: 'ROOT_QUERY', fieldName, broadcast: false });
  }
}
