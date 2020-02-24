import fetch from 'isomorphic-unfetch';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';

function dataIdFromObject(object) {
  switch (object.__typename) {
    case 'Article':
      return `${object.__typename}:${object.slug}`;
    case 'Profile':
      return `${object.__typename}:${object.username}`;
    default:
      return defaultDataIdFromObject(object);
  }
}

export default function withApollo(Page) {
  return function WrappedWithApollo(props) {
    const client = new ApolloClient({
      defaultOptions: {
        watchQuery: {
          returnPartialData: true
        }
      },
      assumeImmutableResults: true,
      connectToDevTools: process.env.NODE_ENV !== 'production',
      ssrMode: typeof window === 'undefined',
      name: 'Conduit',
      version: '1.0.0',
      cache: new InMemoryCache({
        freezeResults: true,
        resultCaching: true,
        dataIdFromObject,
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
            profileByUsername(_root, args, context) {
              return context.getCacheKey({
                __typename: 'Profile',
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
      }),
      link: ApolloLink.from([
        setContext(function contextSetter(operation, prevContext) {
          const token = localStorage.getItem('token');
          return {
            ...prevContext,
            headers: {
              ...prevContext.headers,
              Authorization: token ? `Bearer ${token}` : undefined
            }
          };
        }),
        new HttpLink({
          fetch,
          uri: 'http://localhost:4000/graphql'
        })
      ])
    });
    return (
      <ApolloProvider client={client}>
        <Page {...props} />
      </ApolloProvider>
    );
  };
}
