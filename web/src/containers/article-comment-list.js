import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { CommentList } from '../components/comment-list';

export function ArticleCommentList(props) {
  const commentsList = useQuery(ArticleCommentListQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      slug: props.articleSlug
    }
  });

  const [deleteComment] = useMutation(ArticleCommentListDeleteCommentMutation, {
    update(proxy, mutationResult) {
      const commentsList = proxy.readQuery({
        query: ArticleCommentListQuery,
        variables: { slug: props.articleSlug }
      });

      proxy.writeQuery({
        query: ArticleCommentListQuery,
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
    }
  });

  const [createComment] = useMutation(ArticleCommentListCreateCommentMutation, {
    update(proxy, mutationResult) {
      const commentsList = proxy.readQuery({
        query: ArticleCommentListQuery,
        variables: { slug: props.articleSlug }
      });

      proxy.writeQuery({
        query: ArticleCommentListQuery,
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
    }
  });

  if (commentsList.loading) return null;

  return (
    <CommentList
      onCreate={createComment}
      onDelete={deleteComment}
      viewer={commentsList.data.viewer}
      {...commentsList.data.article}
    />
  );
}

ArticleCommentList.propTypes = {
  articleSlug: PropTypes.string.isRequired
};

const ArticleCommentListCommentFragment = gql`
  fragment ArticleCommentListCommentFragment on Comment {
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

ArticleCommentList.fragments = {
  viewer: gql`
    fragment ArticleCommentListViewerFragment on User {
      username
      profile {
        imageUrl
      }
    }
  `,
  article: gql`
    fragment ArticleCommentListArticleFragment on Article {
      slug
      canCreateComment {
        value
      }
      comments {
        ...ArticleCommentListCommentFragment
      }
    }
    ${ArticleCommentListCommentFragment}
  `
};

const ArticleCommentListQuery = gql`
  query ArticleCommentListQuery($slug: ID!) {
    viewer {
      ...ArticleCommentListViewerFragment
    }
    article: articleBySlug(slug: $slug) {
      ...ArticleCommentListArticleFragment
    }
  }
  ${ArticleCommentList.fragments.viewer}
  ${ArticleCommentList.fragments.article}
`;

const ArticleCommentListCreateCommentMutation = gql`
  mutation ArticleCommentListCreateCommentMutation(
    $articleSlug: ID!
    $input: CreateCommentInput!
  ) {
    createComment(articleSlug: $articleSlug, input: $input) {
      comment {
        ...ArticleCommentListCommentFragment
      }
    }
  }
  ${ArticleCommentListCommentFragment}
`;

const ArticleCommentListDeleteCommentMutation = gql`
  mutation ArticleCommentListDeleteCommentMutation($id: ID!) {
    deleteComment(id: $id) {
      comment {
        ...ArticleCommentListCommentFragment
      }
    }
  }
  ${ArticleCommentListCommentFragment}
`;
