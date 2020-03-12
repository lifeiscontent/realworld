import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

export function UserFollowButton({
  disabled,
  followersCount,
  onFollow,
  onUnfollow,
  username,
  viewerIsFollowing
}) {
  const handleClick = useCallback(
    event => {
      event.preventDefault();
      if (viewerIsFollowing) {
        onUnfollow({ variables: { username } });
      } else {
        onFollow({ variables: { username } });
      }
    },
    [onFollow, onUnfollow, username, viewerIsFollowing]
  );

  return (
    <button
      className={clsx('btn btn-sm action-btn', {
        'btn-outline-secondary': viewerIsFollowing === false,
        'btn-secondary': viewerIsFollowing
      })}
      disabled={disabled}
      onClick={handleClick}
    >
      <i className="ion-plus-round" />{' '}
      {viewerIsFollowing ? 'Unfollow' : 'Follow'} {username} ({followersCount})
    </button>
  );
}

UserFollowButton.defaultProps = {
  followersCount: 0,
  viewerIsFollowing: false,
  disabled: false
};

UserFollowButton.propTypes = {
  disabled: PropTypes.bool,
  followersCount: PropTypes.number,
  onFollow: PropTypes.func.isRequired,
  onUnfollow: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  viewerIsFollowing: PropTypes.bool
};
