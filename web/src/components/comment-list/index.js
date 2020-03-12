import React from 'react';
import PropTypes from 'prop-types';
import { CommentCard } from '../comment-card';

export function CommentList({ comments, onDelete }) {
  return (
    <>
      {comments.map(comment => (
        <CommentCard key={comment.id} onDelete={onDelete} {...comment} />
      ))}
    </>
  );
}

CommentList.defaultProps = {
  comments: []
};

CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object.isRequired),
  onDelete: PropTypes.func.isRequired
};
