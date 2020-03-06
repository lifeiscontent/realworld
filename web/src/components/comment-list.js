import React from 'react';
import PropTypes from 'prop-types';
import { CommentCard } from '../components/comment-card';
import gql from 'graphql-tag';
import { CommentForm } from '../components/comment-form';
import { handleValidationError } from '../utils/graphql';

export function CommentList({
  canCreateComment,
  comments,
  onCreate,
  onDelete,
  slug,
  viewer
}) {
  return (
    <>
      {canCreateComment.value ? (
        <CommentForm
          articleSlug={slug}
          onSubmit={(values, { setSubmitting, setStatus, resetForm }) => {
            onCreate({
              variables: values
            })
              .then(() => resetForm())
              .catch(err => {
                handleValidationError(err, setStatus);
                console.error(err);
              })
              .finally(() => setSubmitting(false));
          }}
          {...viewer}
        />
      ) : null}
      {comments.map(comment => (
        <CommentCard key={comment.id} onDelete={onDelete} {...comment} />
      ))}
    </>
  );
}

CommentList.defaultProps = {
  canCreateComment: { value: false },
  comments: []
};

CommentList.propTypes = {
  canCreateComment: PropTypes.shape({ value: PropTypes.bool }),
  comments: PropTypes.arrayOf(PropTypes.object.isRequired),
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
  viewer: PropTypes.object.isRequired
};

CommentList.fragments = {
  article: gql`
    fragment CommentListArticleFragment on Article {
      slug
      canCreateComment {
        value
      }
      comments {
        ...CommentCardCommentFragment
      }
    }
    ${CommentCard.fragments.comment}
  `,
  comment: gql`
    fragment CommentListCommentFragment on Comment {
      ...CommentCardCommentFragment
    }
    ${CommentCard.fragments.comment}
  `,
  viewer: gql`
    fragment CommentListUserFragment on User {
      ...CommentFormUserFragment
    }
    ${CommentForm.fragments.viewer}
  `
};
