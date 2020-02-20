import fetch from "isomorphic-unfetch";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";

export default function withApollo(Page) {
  return function WrappedWithApollo(props) {
    const client = new ApolloClient({
      cache: new InMemoryCache({
        cacheRedirects: {
          Query: {
            article(_root, args, context) {
              return context.getCacheKey({
                __typename: "Article",
                id: args.id
              });
            },
            tag(_root, args, context) {
              return context.getCacheKey({
                __typename: "Tag",
                id: args.id
              });
            }
          }
        }
      }),
      link: new HttpLink({
        fetch,
        uri: "http://localhost:4000/graphql"
      })
    });
    return (
      <ApolloProvider client={client}>
        <Page {...props} />
      </ApolloProvider>
    );
  };
}
