import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { format } from '../../utils/date';
import Markdown from 'react-markdown';
import { gql } from '@apollo/client';
import Image from 'next/image';

export function CommentCard({
  author,
  body,
  createdAt,
  id,
  onDelete,
  canDelete,
}) {
  const { profile = {} } = author;

  const handleDelete = event => {
    event.preventDefault();
    onDelete({ variables: { id } });
  };

  return (
    <div className="card">
      <div className="card-block">
        <div className="card-text">
          <Markdown>{body}</Markdown>
        </div>
      </div>
      <div className="card-footer">
        <Link href={`/user/${author.username}`} className="comment-author">
          <span style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
            <Image
              alt={`Image of ${author.username}`}
              className="comment-author-img"
              height="20"
              src={profile.imageUrl ?? '/images/smiley-cyrus.jpg'}
              unoptimized={!!profile.imageUrl}
              width="20"
            />
          </span>
          <span className="comment-author-name">{author.username}</span>
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Link href={`/user/${author.username}`} className="comment-author">
          {author.username}
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

CommentCard.fragments = {
  comment: gql`
    fragment CommentCardCommentFragment on Comment {
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
  `,
};

CommentCard.defaultProps = {
  canDelete: { value: false },
  author: {},
};

CommentCard.propTypes = {
  author: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profile: PropTypes.shape({ imageUrl: PropTypes.string }),
  }),
  body: PropTypes.string.isRequired,
  canDelete: PropTypes.shape({ value: PropTypes.bool }),
  createdAt: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};
