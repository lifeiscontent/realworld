import ArticlePage, { queryToVariables } from '../../containers/article-page';
import { initializeApollo } from '../../lib/apolloClient';

export default ArticlePage;

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo(ctx);

  await apolloClient.query({
    query: ArticlePage.query,
    variables: queryToVariables(ctx.query),
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
