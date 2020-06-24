import FeedPage, { queryToVariables } from '../containers/feed-page';
import { initializeApollo } from '../lib/apolloClient';

export default FeedPage;

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo(ctx);

  await apolloClient.query({
    query: FeedPage.query,
    variables: queryToVariables(ctx.query),
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
