import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { format } from '../../utils/date';
import Markdown from 'react-markdown';

export function CommentCard({
  author,
  body,
  createdAt,
  id,
  onDelete,
  canDelete
}) {
  const { profile = {} } = author;

  const handleDelete = useCallback(() => onDelete({ variables: { id } }), [
    id,
    onDelete
  ]);

  return (
    <div className="card">
      <div className="card-block">
        <div className="card-text">
          <Markdown source={body} />
        </div>
      </div>
      <div className="card-footer">
        <Link href="/[username]" as={`/${author.username}`}>
          <a className="comment-author">
            <img
              src={profile.imageUrl ?? '/images/smiley-cyrus.jpg'}
              className="comment-author-img"
              alt={`Image of ${author.username}`}
            />
          </a>
        </Link>
        &nbsp;&nbsp;
        <Link href="/[username]" as={`/${author.username}`}>
          <a className="comment-author">{author.username}</a>
        </Link>
        <time dateTime={createdAt} className="date-posted">
          {format(new Date(createdAt), 'MMM Qo')}
        </time>
        <span className="mod-options">
          {canDelete.value ? (
            <i className="ion-trash-a" onClick={handleDelete} />
          ) : null}
        </span>
      </div>
    </div>
  );
}

CommentCard.defaultProps = {
  canDelete: { value: false },
  author: {}
};

CommentCard.propTypes = {
  author: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profile: PropTypes.shape({ imageUrl: PropTypes.string })
  }),
  body: PropTypes.string.isRequired,
  canDelete: PropTypes.shape({ value: PropTypes.bool }),
  createdAt: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
};
