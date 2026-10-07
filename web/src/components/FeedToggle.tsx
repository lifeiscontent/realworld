import { clsx } from 'clsx';
import { Link } from 'react-router';
import { paths } from '../lib/paths';

interface FeedToggleProps {
  /** Shows the Your Feed tab. Only signed-in users have a feed. */
  showYourFeed: boolean;
  feed: 'following' | 'global' | 'tag';
  tag?: string;
}

export function FeedToggle({ showYourFeed, feed, tag }: FeedToggleProps) {
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {showYourFeed && (
          <li className="nav-item">
            <Link
              className={clsx('nav-link', { active: feed === 'following' })}
              to="/?feed=following"
            >
              Your Feed
            </Link>
          </li>
        )}
        <li className="nav-item">
          <Link
            className={clsx('nav-link', { active: feed === 'global' })}
            to="/"
          >
            Global Feed
          </Link>
        </li>
        {feed === 'tag' && tag && (
          <li className="nav-item">
            <Link className="nav-link active" to={paths.tag(tag)}>
              #{tag}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
