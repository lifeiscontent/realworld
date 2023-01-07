import FeedPage, { queryToVariables } from '../containers/feed-page';
import { initializeApollo, addApolloState } from '../lib/apolloClient';

export default FeedPage;

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: FeedPage.query,
    variables: queryToVariables(ctx.query),
  });

  return addApolloState(apolloClient, {
    props: {},
  });
}
