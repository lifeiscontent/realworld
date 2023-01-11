import ProfilePage, { queryToVariables } from '../../containers/profile-page';
import { addApolloState, initializeApollo } from '../../lib/apolloClient';

export default ProfilePage;

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo(ctx);

  await apolloClient.query({
    query: ProfilePage.query,
    variables: queryToVariables(ctx.query),
  });

  return addApolloState(apolloClient, {
    props: {},
  });
}
