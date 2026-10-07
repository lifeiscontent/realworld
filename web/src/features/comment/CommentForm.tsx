import { useEffect, useRef } from 'react';
import { href, useFetcher } from 'react-router';

import { type ActionResult, errorsOf } from '../../lib/forms';
import { Avatar } from '../../ui/Avatar';
import { Button } from '../../ui/Button';
import { ErrorMessages } from '../../ui/ErrorMessages';

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
        action={href('/article/:slug/comments', { slug })}
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
          <Avatar
            className="comment-author-img"
            name={viewer.username}
            image={viewer.image}
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={fetcher.state !== 'idle'}
          >
            Post Comment
          </Button>
        </div>
      </fetcher.Form>
    </>
  );
}
