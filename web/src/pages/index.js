import IndexPage, { queryToVariables } from '../containers/index-page';
import { addApolloState, initializeApollo } from '../lib/apolloClient';

export default IndexPage;

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: IndexPage.query,
    variables: queryToVariables(ctx.query),
  });

  return addApolloState(apolloClient, {
    props: {},
  });
}
