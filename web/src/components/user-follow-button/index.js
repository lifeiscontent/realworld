import PropTypes from 'prop-types';
import clsx from 'clsx';
import { gql } from '@apollo/client';

export function UserFollowButton({
  canFollow = { value: false },
  canUnfollow = { value: false },
  followersCount = 0,
  onFollow,
  onUnfollow,
  username,
  viewerIsFollowing = false,
}) {
  const handleClick = event => {
    event.preventDefault();
    if (viewerIsFollowing) {
      onUnfollow({ variables: { username } });
    } else {
      onFollow({ variables: { username } });
    }
  };

  return (
    <button
      className={clsx('btn btn-sm action-btn', {
        'btn-outline-secondary': viewerIsFollowing === false,
        'btn-secondary': viewerIsFollowing,
      })}
      disabled={!canFollow.value && !canUnfollow.value}
      onClick={handleClick}
    >
      <i className="ion-plus-round" />{' '}
      {viewerIsFollowing ? 'Unfollow' : 'Follow'} {username} ({followersCount})
    </button>
  );
}

UserFollowButton.fragments = {
  user: gql`
    fragment UserFollowButtonUserFragment on User {
      canFollow {
        value
      }
      canUnfollow {
        value
      }
      followersCount
      username
      viewerIsFollowing
    }
  `,
};

UserFollowButton.propTypes = {
  canFollow: PropTypes.shape({ value: PropTypes.bool }),
  canUnfollow: PropTypes.shape({ value: PropTypes.bool }),
  followersCount: PropTypes.number,
  onFollow: PropTypes.func.isRequired,
  onUnfollow: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  viewerIsFollowing: PropTypes.bool,
};
