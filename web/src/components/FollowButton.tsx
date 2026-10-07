import { clsx } from 'clsx';
import { useFetcher } from 'react-router';
import { errorsOf, type ActionResult } from '../lib/forms';
import { ErrorMessages } from './ErrorMessages';
import { paths } from '../lib/paths';

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
      action={paths.profileFollow(username)}
      style={{ display: 'inline' }}
    >
      <button
        type="submit"
        className={clsx('btn btn-sm', className, {
          'btn-outline-secondary': !following,
          'btn-secondary': following,
        })}
      >
        <i className="ion-plus-round" />
        &nbsp; {following ? 'Unfollow' : 'Follow'} {username}
      </button>
      <ErrorMessages messages={errorsOf(fetcher.data)} />
    </fetcher.Form>
  );
}
