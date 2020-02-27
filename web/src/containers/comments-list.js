import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { CommentCard } from './comment-card';
import gql from 'graphql-tag';
import { CommentForm } from './comment-form';

export function CommentsList(props) {
  const commentsList = useQuery(CommentsListQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      slug: props.articleSlug
    }
  });

  const handleDeleteComment = useCallback(
    (proxy, mutationResult) => {
      const commentsList = proxy.readQuery({
        query: CommentsListQuery,
        variables: { slug: props.articleSlug }
      });

      proxy.writeQuery({
        query: CommentsListQuery,
        variables: { slug: props.articleSlug },
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
    },
    [props.articleSlug]
  );

  const handleCreateComment = useCallback(
    (proxy, mutationResult) => {
      const commentsList = proxy.readQuery({
        query: CommentsListQuery,
        variables: { slug: props.articleSlug }
      });

      proxy.writeQuery({
        query: CommentsListQuery,
        variables: { slug: props.articleSlug },
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
    },
    [props.articleSlug]
  );

  if (commentsList.loading) return null;

  return (
    <>
      {commentsList.data.article.canCreateComment.value ? (
        <CommentForm
          userId={props.userId}
          articleSlug={props.articleSlug}
          onCreateComment={handleCreateComment}
        />
      ) : null}
      {commentsList.data.article.comments.map(comment => (
        <CommentCard
          key={comment.id}
          commentId={comment.id}
          onDeleteComment={handleDeleteComment}
        />
      ))}
    </>
  );
}

CommentsList.propTypes = {
  userId: PropTypes.string,
  articleSlug: PropTypes.string.isRequired
};

CommentsList.fragments = {
  user: gql`
    fragment CommentsListUserFragment on User {
      ...CommentFormUserFragment
    }
    ${CommentForm.fragments.user}
  `,
  article: gql`
    fragment CommentsListArticleFragment on Article {
      slug
      comments {
        ...CommentCardCommentFragment
      }
      ...CommentFormArticleFragment
    }
    ${CommentCard.fragments.comment}
    ${CommentForm.fragments.article}
  `
};

const CommentsListQuery = gql`
  query CommentsListQuery($slug: String!) {
    article: articleBySlug(slug: $slug) {
      ...CommentsListArticleFragment
      canCreateComment {
        value
      }
    }
  }
  ${CommentsList.fragments.article}
`;
