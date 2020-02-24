import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

export function DeleteCommentButton(props) {
  const deleteCommentButton = useQuery(DeleteCommentButtonQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      id: props.id
    },
    skip: typeof props.id !== 'string'
  });
  const [deleteComment] = useMutation(
    DeleteCommentButtonDeleteCommentMutation,
    {
      variables: {
        id: deleteCommentButton.data?.comment?.id
      },
      update: props.onDelete
    }
  );
  const isActionable =
    deleteCommentButton.data?.comment?.canDelete?.value ?? false;
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
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
};

DeleteCommentButton.fragments = {
  comment: gql`
    fragment DeleteCommentButtonCommentFragment on Comment {
      id
      canDelete {
        value
      }
    }
  `
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
