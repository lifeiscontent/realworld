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

  const handleCreate = useCallback(
    (proxy, mutationResult) => {
      const commentsList = proxy.readQuery({
        query: CommentsListQuery,
        variables: { slug: props.slug }
      });

      console.log(commentsList, mutationResult);

      proxy.writeQuery({
        query: CommentsListQuery,
        variables: { slug: props.slug },
        data: {
          ...commentsList,
          article: {
            ...commentsList.article,
            commentsConnection: {
              ...commentsList.article.commentsConnection,
              edges: [
                {
                  node: mutationResult.data.createComment.comment,
                  __typename: 'CommentEdge'
                },
                ...commentsList.article.commentsConnection.edges
              ]
            }
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
        commentsList.data?.article?.commentsConnection?.edges?.map(edge => (
          <CommentCard key={edge.node.id} id={edge.node.id} />
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
      commentsConnection {
        edges {
          node {
            ...CommentCardCommentFragment
          }
        }
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
