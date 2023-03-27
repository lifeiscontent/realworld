import PropTypes from 'prop-types';
import Link from 'next/link';
import { format } from '../../utils/date';
import Markdown from 'react-markdown';
import { gql } from '@apollo/client';
import Image from 'next/image';

export function CommentCard({
  author,
  body,
  canDelete,
  createdAt,
  id,
  onDelete,
}) {
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
          <Image
            alt={`Image of ${author.username}`}
            className="comment-author-img"
            height="20"
            src={author?.profile?.imageUrl ?? '/images/smiley-cyrus.jpg'}
            unoptimized={!!author?.profile?.imageUrl}
            priority
            width="20"
          />
          &nbsp;&nbsp;
          <span className="comment-author-name">{author.username}</span>
        </Link>
        <time dateTime={createdAt} className="date-posted">
          {format(new Date(createdAt), 'MMM Qo')}
        </time>
        <span className="mod-options">
          {canDelete?.value ? (
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
