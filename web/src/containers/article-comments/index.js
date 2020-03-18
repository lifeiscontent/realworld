import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { UserCommentForm } from '../../components/user-comment-form';
import { handleValidationError } from '../../utils/graphql';
import { CommentCard } from '../../components/comment-card';

export function ArticleComments({ articleSlug }) {
  const commentsList = useQuery(ArticleCommentsQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      slug: articleSlug
    }
  });

  const [deleteComment] = useMutation(ArticleCommentsDeleteCommentMutation, {
    update(proxy, mutationResult) {
      const commentsList = proxy.readQuery({
        query: ArticleCommentsQuery,
        variables: { slug: articleSlug }
      });

      proxy.writeQuery({
        query: ArticleCommentsQuery,
        variables: { slug: articleSlug },
        data: {
          ...commentsList,
          article: {
            ...commentsList.article,
            comments: [
              ...commentsList.article.comments.filter(
                comment =>
                  comment.id !== mutationResult.data.deleteComment.comment.id
              )
            ]
          }
        }
      });
    }
  });

  const [createComment] = useMutation(ArticleCommentsCreateCommentMutation, {
    update(proxy, mutationResult) {
      const commentsList = proxy.readQuery({
        query: ArticleCommentsQuery,
        variables: { slug: articleSlug }
      });

      proxy.writeQuery({
        query: ArticleCommentsQuery,
        variables: { slug: articleSlug },
        data: {
          ...commentsList,
          article: {
            ...commentsList.article,
            comments: [
              mutationResult.data.createComment.comment,
              ...commentsList.article.comments
            ]
          }
        }
      });
    }
  });

  const handleSubmit = useCallback(
    (values, { setSubmitting, setStatus, resetForm }) => {
      createComment({
        variables: values
      })
        .then(() => resetForm())
        .catch(err => {
          handleValidationError(err, setStatus);
          console.error(err);
        })
        .finally(() => setSubmitting(false));
    },
    [createComment]
  );

  if (commentsList.loading) return null;

  return (
    <>
      <UserCommentForm
        articleSlug={articleSlug}
        canCreateComment={commentsList.data.article.canCreateComment}
        onSubmit={handleSubmit}
        {...commentsList.data.viewer}
      />
      {commentsList.data.article.comments.map(comment => (
        <CommentCard key={comment.id} onDelete={deleteComment} {...comment} />
      ))}
    </>
  );
}

ArticleComments.propTypes = {
  articleSlug: PropTypes.string.isRequired
};

ArticleComments.fragments = {
  viewer: gql`
    fragment ArticleCommentsViewerFragment on User {
      ...UserCommentFormUserFragment
    }
    ${UserCommentForm.fragments.user}
  `,
  article: gql`
    fragment ArticleCommentsArticleFragment on Article {
      ...UserCommentFormArticleFragment
      comments {
        ...CommentCardCommentFragment
      }
    }
    ${UserCommentForm.fragments.article}
    ${CommentCard.fragments.comment}
  `
};

export const ArticleCommentsQuery = gql`
  query ArticleCommentsQuery($slug: ID!) {
    viewer {
      ...ArticleCommentsViewerFragment
    }
    article: articleBySlug(slug: $slug) {
      ...ArticleCommentsArticleFragment
    }
  }
  ${ArticleComments.fragments.viewer}
  ${ArticleComments.fragments.article}
`;

const ArticleCommentsCreateCommentMutation = gql`
  mutation ArticleCommentsCreateCommentMutation(
    $articleSlug: ID!
    $input: CreateCommentInput!
  ) {
    createComment(articleSlug: $articleSlug, input: $input) {
      comment {
        ...CommentCardCommentFragment
      }
    }
  }
  ${CommentCard.fragments.comment}
`;

const ArticleCommentsDeleteCommentMutation = gql`
  mutation ArticleCommentsDeleteCommentMutation($id: ID!) {
    deleteComment(id: $id) {
      comment {
        ...CommentCardCommentFragment
      }
    }
  }
  ${CommentCard.fragments.comment}
`;
