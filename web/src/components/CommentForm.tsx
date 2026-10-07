import { useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';
import { errorsOf, type ActionResult } from '../lib/forms';
import { ErrorMessages } from './ErrorMessages';
import { UserAvatar } from './UserAvatar';
import { paths } from '../lib/paths';

interface CommentFormProps {
  slug: string;
  viewer: { username: string; image?: string | null };
}

/** Posts a comment to /article/:slug/comments, and clears after it is saved. */
export function CommentForm({ slug, viewer }: CommentFormProps) {
  const fetcher = useFetcher<ActionResult>();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.ok) formRef.current?.reset();
  }, [fetcher.state, fetcher.data]);

  return (
    <>
      <ErrorMessages messages={errorsOf(fetcher.data)} />
      <fetcher.Form
        ref={formRef}
        method="post"
        action={paths.articleComments(slug)}
        className="card comment-form"
      >
        <div className="card-block">
          <textarea
            name="body"
            className="form-control"
            placeholder="Write a comment..."
            aria-label="Write a comment..."
            rows={3}
          />
        </div>
        <div className="card-footer">
          <UserAvatar
            className="comment-author-img"
            username={viewer.username}
            image={viewer.image}
          />
          <button
            type="submit"
            className="btn btn-sm btn-primary"
            disabled={fetcher.state !== 'idle'}
          >
            Post Comment
          </button>
        </div>
      </fetcher.Form>
    </>
  );
}
