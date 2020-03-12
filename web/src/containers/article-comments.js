import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { CommentList } from '../components/comment-list';
import { CommentForm } from '../components/comment-form';
import { handleValidationError } from '../utils/graphql';

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
      <CommentForm
        articleSlug={articleSlug}
        canCreateComment={commentsList.data.article.canCreateComment}
        profile={commentsList.data.viewer.profile}
        username={commentsList.data.viewer.username}
        onSubmit={handleSubmit}
      />
      <CommentList
        comments={commentsList.data.article.comments}
        onDelete={deleteComment}
      />
    </>
  );
}

ArticleComments.propTypes = {
  articleSlug: PropTypes.string.isRequired
};

const ArticleCommentsCommentFragment = gql`
  fragment ArticleCommentsCommentFragment on Comment {
    author {
      username
      profile {
        imageUrl
      }
    }
    body
    canDelete {
      value
    }
    createdAt
    id
  }
`;

ArticleComments.fragments = {
  viewer: gql`
    fragment ArticleCommentsViewerFragment on User {
      username
      profile {
        imageUrl
      }
    }
  `,
  article: gql`
    fragment ArticleCommentsArticleFragment on Article {
      slug
      canCreateComment {
        value
      }
      comments {
        ...ArticleCommentsCommentFragment
      }
    }
    ${ArticleCommentsCommentFragment}
  `
};

const ArticleCommentsQuery = gql`
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
        ...ArticleCommentsCommentFragment
      }
    }
  }
  ${ArticleCommentsCommentFragment}
`;

const ArticleCommentsDeleteCommentMutation = gql`
  mutation ArticleCommentsDeleteCommentMutation($id: ID!) {
    deleteComment(id: $id) {
      comment {
        ...ArticleCommentsCommentFragment
      }
    }
  }
  ${ArticleCommentsCommentFragment}
`;
