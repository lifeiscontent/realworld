import IndexPage, { queryToVariables } from '../containers/index-page';
import { initializeApollo } from '../lib/apolloClient';

export default IndexPage;

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo(ctx);

  await apolloClient.query({
    query: IndexPage.query,
    variables: queryToVariables(ctx.query),
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
