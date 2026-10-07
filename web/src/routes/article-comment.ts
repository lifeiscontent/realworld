import { gql, type TypedDocumentNode } from '@apollo/client';

import { apolloClientContext } from '../app/context';
import { actionOk, attempt } from '../lib/forms';
import { actionOnlyLoader, methodNotAllowed } from '../lib/responses';
import type {
  DeleteCommentMutation,
  DeleteCommentMutationVariables,
} from '../types/__generated__/graphql';
import type { Route } from './+types/article-comment';

export const clientLoader = actionOnlyLoader;

const DELETE_COMMENT_MUTATION: TypedDocumentNode<
  DeleteCommentMutation,
  DeleteCommentMutationVariables
> = gql`
  mutation DeleteComment($slug: String!, $id: ID!) {
    deleteComment(slug: $slug, id: $id)
  }
`;

/**
 * DELETE /article/:slug/comments/:id deletes a comment. The comment leaves
 * the cache at once, and comes back if the API fails.
 */
export async function clientAction({
  request,
  params,
  context,
}: Route.ClientActionArgs) {
  if (request.method !== 'DELETE') throw methodNotAllowed();

  const client = context.get(apolloClientContext);
  const { failure } = await attempt(() =>
    client.mutate({
      mutation: DELETE_COMMENT_MUTATION,
      variables: params,
      optimisticResponse: { deleteComment: true },
      update(cache) {
        cache.evict({
          id: cache.identify({ __typename: 'Comment', id: params.id }),
        });
        cache.gc();
      },
    })
  );
  return failure ?? actionOk;
}
