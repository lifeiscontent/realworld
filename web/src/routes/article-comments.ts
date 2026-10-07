import { gql, type TypedDocumentNode } from '@apollo/client';
import type { ActionFunctionArgs } from 'react-router';
import { z } from 'zod';

import { apolloClientContext } from '../app/context';
import { COMMENT_CARD_FRAGMENT } from '../features/comment/CommentCard';
import { actionErrors, actionOk, attempt, parseForm } from '../lib/forms';
import { requireParam } from '../lib/params';
import { actionOnlyLoader, methodNotAllowed } from '../lib/responses';
import type {
  AddCommentMutation,
  AddCommentMutationVariables,
  ArticleCommentsQuery,
  ArticleCommentsQueryVariables,
} from '../types/__generated__/graphql';

export const loader = actionOnlyLoader;

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
export async function action({ request, params, context }: ActionFunctionArgs) {
  if (request.method !== 'POST') throw methodNotAllowed();

  const slug = requireParam(params, 'slug');
  const { values, errors } = parseForm(schema, await request.formData());
  if (errors) return actionErrors(errors);

  const client = context.get(apolloClientContext);
  const { failure } = await attempt(() =>
    client.mutate({
      mutation: ADD_COMMENT_MUTATION,
      variables: { slug, comment: values },
      update(cache, { data }) {
        const comment = data?.addComment;
        if (!comment) return;
        cache.updateQuery(
          { query: ARTICLE_COMMENTS_QUERY, variables: { slug } },
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
