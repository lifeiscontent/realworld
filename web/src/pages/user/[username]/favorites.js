import ProfileFavoritesPage, {
  queryToVariables,
} from '../../../containers/profile-favorites-page';
import { initializeApollo } from '../../../lib/apolloClient';

export default ProfileFavoritesPage;

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo(ctx);

  await apolloClient.query({
    query: ProfileFavoritesPage.query,
    variables: queryToVariables(ctx.query),
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
