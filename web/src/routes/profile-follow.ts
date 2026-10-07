import type { ActionFunctionArgs } from 'react-router';
import { apolloClientContext } from '../app/context';
import { actionOk, attempt } from '../lib/forms';
import { requireParam } from '../lib/params';
import { actionOnlyLoader, methodNotAllowed } from '../lib/responses';
import { gql, type TypedDocumentNode } from '@apollo/client';
import type {
  FollowUserMutation,
  FollowUserMutationVariables,
  UnfollowUserMutation,
  UnfollowUserMutationVariables,
} from '../types/__generated__/graphql';

export const loader = actionOnlyLoader;

const FOLLOW_USER_MUTATION: TypedDocumentNode<
  FollowUserMutation,
  FollowUserMutationVariables
> = gql`
  mutation FollowUser($username: String!) {
    followUser(username: $username) {
      username
      following
    }
  }
`;

const UNFOLLOW_USER_MUTATION: TypedDocumentNode<
  UnfollowUserMutation,
  UnfollowUserMutationVariables
> = gql`
  mutation UnfollowUser($username: String!) {
    unfollowUser(username: $username) {
      username
      following
    }
  }
`;

/**
 * POST /profile/:username/follow follows, DELETE unfollows. The optimistic
 * result updates the cache at once, and the routes do not load again.
 */
export async function action({ request, params, context }: ActionFunctionArgs) {
  const username = requireParam(params, 'username');
  const client = context.get(apolloClientContext);
  const follow = request.method === 'POST';
  if (!follow && request.method !== 'DELETE') throw methodNotAllowed();

  const profile = {
    __typename: 'Profile' as const,
    username,
    following: follow,
  };
  const { failure } = await attempt(async () => {
    if (follow) {
      await client.mutate({
        mutation: FOLLOW_USER_MUTATION,
        variables: { username },
        optimisticResponse: { followUser: profile },
      });
      return;
    }
    await client.mutate({
      mutation: UNFOLLOW_USER_MUTATION,
      variables: { username },
      optimisticResponse: { unfollowUser: profile },
    });
  });
  return failure ?? actionOk;
}
