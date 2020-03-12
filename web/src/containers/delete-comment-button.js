import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

export function DeleteCommentButton(props) {
  const deleteCommentButton = useQuery(DeleteCommentButtonQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      id: props.commentId
    }
  });

  const [deleteComment] = useMutation(
    DeleteCommentButtonDeleteCommentMutation,
    {
      variables: {
        id: props.commentId
      },
      update: props.onDeleteComment
    }
  );

  if (deleteCommentButton.loading) return null;

  const isActionable =
    deleteCommentButton.data.comment.canDelete.value ?? false;

  return isActionable ? (
    <i
      className="ion-trash-a"
      onClick={event => {
        event.preventDefault();
        deleteComment();
      }}
    />
  ) : null;
}

DeleteCommentButton.propTypes = {
  commentId: PropTypes.string.isRequired,
  onDeleteComment: PropTypes.func.isRequired
};

const DeleteCommentButtonQuery = gql`
  query DeleteCommentButtonQuery($id: ID!) {
    comment(id: $id) {
      ...DeleteCommentButtonCommentFragment
    }
  }
  ${DeleteCommentButton.fragments.comment}
`;

const DeleteCommentButtonDeleteCommentMutation = gql`
  mutation DeleteCommentButtonDeleteCommentMutation($id: ID!) {
    deleteComment(id: $id) {
      comment {
        ...DeleteCommentButtonCommentFragment
      }
    }
  }
  ${DeleteCommentButton.fragments.comment}
`;
