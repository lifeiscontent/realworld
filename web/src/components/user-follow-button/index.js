import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import gql from 'graphql-tag';

export function UserFollowButton({
  canFollow,
  canUnfollow,
  followersCount,
  onFollow,
  onUnfollow,
  username,
  viewerIsFollowing,
}) {
  const disabled = !(canFollow.value || canUnfollow.value);
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
      disabled={disabled}
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

UserFollowButton.defaultProps = {
  followersCount: 0,
  viewerIsFollowing: false,
  canFollow: { value: false },
  canUnfollow: { value: false },
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
