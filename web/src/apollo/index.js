import { ApolloClient } from 'apollo-client';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';

export default function createApolloClient(initialState, ctx) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    assumeImmutableResults: true,
    connectToDevTools: Boolean(ctx),
    ssrMode: typeof window === 'undefined',
    name: 'Conduit',
    version: '1.0.0',
    link: new HttpLink({
      headers: ctx?.req?.headers,
      fetch,
      credentials: 'include',
      uri: process.env.GRAPHQL_URL
    }),
    cache: new InMemoryCache(cacheConfig).restore(initialState)
  });
}

const cacheConfig = {
  freezeResults: true,
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
  cacheRedirects: {
    Query: {
      articleBySlug(_root, args, context) {
        return context.getCacheKey({
          __typename: 'Article',
          slug: args.slug
        });
      },
      comment(_root, args, context) {
        return context.getCacheKey({
          __typename: 'Comment',
          id: args.id
        });
      },
      userByUsername(_root, args, context) {
        return context.getCacheKey({
          __typename: 'User',
          username: args.username
        });
      },
      tag(_root, args, context) {
        return context.getCacheKey({
          __typename: 'Tag',
          id: args.id
        });
      }
    }
  }
};
