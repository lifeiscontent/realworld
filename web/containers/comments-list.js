import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { CommentCard } from './comment-card';
import gql from 'graphql-tag';
import { CommentForm } from './comment-form';

export function CommentsList(props) {
  const commentsList = useQuery(CommentsListQuery, {
    variables: {
      slug: props.slug
    },
    skip: typeof props.slug !== 'string'
  });

  const handleDelete = useCallback(
    (proxy, mutationResult) => {
      const commentsList = proxy.readQuery({
        query: CommentsListQuery,
        variables: { slug: props.slug }
      });

      proxy.writeQuery({
        query: CommentsListQuery,
        variables: { slug: props.slug },
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
    [props.slug]
  );

  const handleCreate = useCallback(
    (proxy, mutationResult) => {
      const commentsList = proxy.readQuery({
        query: CommentsListQuery,
        variables: { slug: props.slug }
      });

      proxy.writeQuery({
        query: CommentsListQuery,
        variables: { slug: props.slug },
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
    [props.slug]
  );

  return (
    <>
      <CommentForm
        slug={commentsList.data?.article?.slug}
        onCreate={handleCreate}
      />
      {commentsList.loading ? (
        <div>Loading...</div>
      ) : (
        commentsList.data?.article?.comments?.map(comment => (
          <CommentCard
            key={comment.id}
            id={comment.id}
            onDelete={handleDelete}
          />
        ))
      )}
    </>
  );
}

CommentsList.propTypes = {
  slug: PropTypes.string.isRequired
};

CommentsList.fragments = {
  article: gql`
    fragment CommentsListArticleFragment on Article {
      slug
      comments {
        ...CommentCardCommentFragment
      }
    }
    ${CommentCard.fragments.comment}
  `
};

const CommentsListQuery = gql`
  query CommentsListQuery($slug: String!) {
    article: articleBySlug(slug: $slug) {
      ...CommentsListArticleFragment
    }
  }
  ${CommentsList.fragments.article}
`;
