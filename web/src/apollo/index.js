import fetch from 'isomorphic-unfetch';
import cookie from 'cookie';
import { setContext } from 'apollo-link-context';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';

export default function createApolloClient(initialState, ctx) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  const ssrMode = Boolean(ctx);

  const link = ApolloLink.from([
    setContext(() => {
      const { authorization } =
        typeof window !== 'undefined'
          ? cookie.parse(document.cookie)
          : cookie.parse(ctx?.req?.headers?.cookie ?? '');
      return {
        headers: { authorization }
      };
    }),
    new HttpLink({
      fetch,
      credentials: 'omit',
      uri: process.env.GRAPHQL_URL
    })
  ]);

  const cache = new InMemoryCache(cacheConfig).restore(initialState);

  const client = new ApolloClient({
    assumeImmutableResults: true,
    connectToDevTools: !ssrMode && process.env.NODE_ENV !== 'production',
    ssrMode,
    name: 'Conduit',
    version: '1.0.0',
    link,
    cache
  });

  client.onResetStore(() => cache.restore(initialState));

  return client;
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
