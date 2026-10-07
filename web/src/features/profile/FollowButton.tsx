import { href, useFetcher } from 'react-router';

import { type ActionResult, errorsOf } from '../../lib/forms';
import { Button } from '../../ui/Button';
import { ErrorMessages } from '../../ui/ErrorMessages';

interface FollowButtonProps {
  username: string;
  following: boolean;
  className?: string;
}

/**
 * Posts to /profile/:username/follow: POST follows, DELETE unfollows, like
 * the RealWorld API.
 */
export function FollowButton({
  username,
  following,
  className,
}: FollowButtonProps) {
  const fetcher = useFetcher<ActionResult>();

  return (
    <fetcher.Form
      method={following ? 'delete' : 'post'}
      action={href('/profile/:username/follow', { username })}
      style={{ display: 'inline' }}
    >
      <Button
        type="submit"
        variant="secondary"
        outline={!following}
        size="sm"
        className={className}
        aria-pressed={following}
      >
        <i className="ion-plus-round" />
        &nbsp; {following ? 'Unfollow' : 'Follow'} {username}
      </Button>
      <ErrorMessages messages={errorsOf(fetcher.data)} />
    </fetcher.Form>
  );
}
