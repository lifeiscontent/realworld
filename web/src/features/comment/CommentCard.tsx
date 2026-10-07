import { gql, type TypedDocumentNode } from '@apollo/client';
import { href, Link, useFetcher } from 'react-router';

import { formatDate } from '../../lib/date';
import { type ActionResult, errorsOf } from '../../lib/forms';
import type { CommentCard_CommentFragment } from '../../types/__generated__/graphql';
import { Avatar } from '../../ui/Avatar';
import { ErrorMessages } from '../../ui/ErrorMessages';

export const COMMENT_CARD_FRAGMENT: TypedDocumentNode<CommentCard_CommentFragment> = gql`
  fragment CommentCard_comment on Comment {
    id
    body
    createdAt
    author {
      username
      image
    }
  }
`;

interface CommentCardProps {
  slug: string;
  comment: CommentCard_CommentFragment;
  /** Only the author of a comment can delete it. */
  canDelete: boolean;
}

export function CommentCard({ slug, comment, canDelete }: CommentCardProps) {
  const { author } = comment;
  const fetcher = useFetcher<ActionResult>();

  return (
    <>
      <div className="card">
        <div className="card-block">
          <p className="card-text">{comment.body}</p>
        </div>
        <div className="card-footer">
          <Link
            to={href('/profile/:username/:tab?', { username: author.username })}
            className="comment-author"
          >
            <Avatar
              className="comment-author-img"
              name={author.username}
              image={author.image}
            />
          </Link>
          &nbsp;
          <Link
            to={href('/profile/:username/:tab?', { username: author.username })}
            className="comment-author"
          >
            {author.username}
          </Link>
          <span className="date-posted">{formatDate(comment.createdAt)}</span>
          {canDelete && (
            <span className="mod-options">
              <fetcher.Form
                method="delete"
                action={href('/article/:slug/comments/:id', {
                  slug,
                  id: comment.id,
                })}
                style={{ display: 'inline' }}
              >
                <button
                  type="submit"
                  className="icon-button"
                  aria-label="Delete comment"
                  disabled={fetcher.state !== 'idle'}
                >
                  <i className="ion-trash-a" />
                </button>
              </fetcher.Form>
            </span>
          )}
        </div>
      </div>
      <ErrorMessages messages={errorsOf(fetcher.data)} />
    </>
  );
}
