import { gql, type TypedDocumentNode } from '@apollo/client';
import type { ActionFunctionArgs } from 'react-router';

import { apolloClientContext } from '../app/context';
import { actionOk, attempt } from '../lib/forms';
import { requireParam } from '../lib/params';
import { actionOnlyLoader, methodNotAllowed } from '../lib/responses';
import type {
  DeleteCommentMutation,
  DeleteCommentMutationVariables,
} from '../types/__generated__/graphql';

export const loader = actionOnlyLoader;

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
export async function action({ request, params, context }: ActionFunctionArgs) {
  if (request.method !== 'DELETE') throw methodNotAllowed();

  const slug = requireParam(params, 'slug');
  const id = requireParam(params, 'id');
  const client = context.get(apolloClientContext);
  const { failure } = await attempt(() =>
    client.mutate({
      mutation: DELETE_COMMENT_MUTATION,
      variables: { slug, id },
      optimisticResponse: { deleteComment: true },
      update(cache) {
        cache.evict({ id: cache.identify({ __typename: 'Comment', id }) });
        cache.gc();
      },
    })
  );
  return failure ?? actionOk;
}
