import { gql, type TypedDocumentNode } from '@apollo/client';
import { z } from 'zod';

import { apolloClientContext } from '../app/context';
import { COMMENT_CARD_FRAGMENT } from '../features/comment/CommentCard';
import { actionErrors, actionOk, attempt, parseForm } from '../lib/forms';
import { actionOnlyLoader, methodNotAllowed } from '../lib/responses';
import type {
  AddCommentMutation,
  AddCommentMutationVariables,
  ArticleCommentsQuery,
  ArticleCommentsQueryVariables,
} from '../types/__generated__/graphql';
import type { Route } from './+types/article-comments';

export const clientLoader = actionOnlyLoader;

const ARTICLE_COMMENTS_QUERY: TypedDocumentNode<
  ArticleCommentsQuery,
  ArticleCommentsQueryVariables
> = gql`
  query ArticleComments($slug: String!) {
    comments(slug: $slug) {
      ...CommentCard_comment
    }
  }
  ${COMMENT_CARD_FRAGMENT}
`;

export const ADD_COMMENT_MUTATION: TypedDocumentNode<
  AddCommentMutation,
  AddCommentMutationVariables
> = gql`
  mutation AddComment($slug: String!, $comment: NewComment!) {
    addComment(slug: $slug, comment: $comment) {
      ...CommentCard_comment
    }
  }
  ${COMMENT_CARD_FRAGMENT}
`;

const schema = z.object({
  body: z.string().trim().min(1, "body can't be blank"),
});

/**
 * POST /article/:slug/comments adds a comment. The new comment goes to the
 * top of the cached list, like the API orders it, so the page does not load
 * again.
 */
export async function clientAction({
  request,
  params,
  context,
}: Route.ClientActionArgs) {
  if (request.method !== 'POST') throw methodNotAllowed();

  const { values, errors } = parseForm(schema, await request.formData());
  if (errors) return actionErrors(errors);

  const client = context.get(apolloClientContext);
  const { failure } = await attempt(() =>
    client.mutate({
      mutation: ADD_COMMENT_MUTATION,
      variables: { ...params, comment: values },
      update(cache, { data }) {
        const comment = data?.addComment;
        if (!comment) return;
        cache.updateQuery(
          { query: ARTICLE_COMMENTS_QUERY, variables: params },
          current =>
            current?.comments
              ? { ...current, comments: [comment, ...current.comments] }
              : current
        );
      },
    })
  );
  return failure ?? actionOk;
}
