import fetch from 'isomorphic-unfetch';
import cookie from 'cookie';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import cacheConfig from './cache-config';

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
