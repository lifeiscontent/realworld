import { gql, type TypedDocumentNode } from '@apollo/client';

import { apolloClientContext } from '../app/context';
import { actionOk, attempt } from '../lib/forms';
import { actionOnlyLoader, methodNotAllowed } from '../lib/responses';
import type {
  FollowUserMutation,
  FollowUserMutationVariables,
  UnfollowUserMutation,
  UnfollowUserMutationVariables,
} from '../types/__generated__/graphql';
import type { Route } from './+types/profile-follow';

export const clientLoader = actionOnlyLoader;

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
export async function clientAction({
  request,
  params,
  context,
}: Route.ClientActionArgs) {
  const client = context.get(apolloClientContext);
  const follow = request.method === 'POST';
  if (!follow && request.method !== 'DELETE') throw methodNotAllowed();

  const profile = {
    __typename: 'Profile' as const,
    username: params.username,
    following: follow,
  };
  const { failure } = await attempt(async () => {
    if (follow) {
      await client.mutate({
        mutation: FOLLOW_USER_MUTATION,
        variables: params,
        optimisticResponse: { followUser: profile },
      });
      return;
    }
    await client.mutate({
      mutation: UNFOLLOW_USER_MUTATION,
      variables: params,
      optimisticResponse: { unfollowUser: profile },
    });
  });
  return failure ?? actionOk;
}
