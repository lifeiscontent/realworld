import { Link, useFetcher } from 'react-router';
import { errorsOf, type ActionResult } from '../lib/forms';
import type { CommentCard_CommentFragment } from '../types/__generated__/graphql';
import { formatDate } from '../lib/date';
import { ErrorMessages } from './ErrorMessages';
import { UserAvatar } from './UserAvatar';
import { paths } from '../lib/paths';
import { gql, type TypedDocumentNode } from '@apollo/client';

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
          <Link to={paths.profile(author.username)} className="comment-author">
            <UserAvatar
              className="comment-author-img"
              username={author.username}
              image={author.image}
            />
          </Link>
          &nbsp;
          <Link to={paths.profile(author.username)} className="comment-author">
            {author.username}
          </Link>
          <span className="date-posted">{formatDate(comment.createdAt)}</span>
          {canDelete && (
            <span className="mod-options">
              <fetcher.Form
                method="delete"
                action={paths.articleComment(slug, comment.id)}
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
