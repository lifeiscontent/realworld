import React from 'react';
import PropTypes from 'prop-types';
import { UserFollowButton } from '../user-follow-button';
import { UserUpdateButton } from '../user-update-button';

export function ProfilePageBanner({
  canFollow,
  canUnfollow,
  followersCount,
  isViewer,
  onFollow,
  onUnfollow,
  profile,
  username,
  viewerIsFollowing
}) {
  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <img
              src={
                typeof profile.imageUrl === 'string'
                  ? profile.imageUrl
                  : '/images/smiley-cyrus.jpg'
              }
              className="user-img"
              alt={`Image of ${username}`}
            />
            <h4>{username}</h4>
            <p>{profile.bio}</p>
            <div className="btn-toolbar">
              {isViewer ? <UserUpdateButton /> : null}
              <UserFollowButton
                disabled={!(canFollow.value || canUnfollow.value)}
                followersCount={followersCount}
                onFollow={onFollow}
                onUnfollow={onUnfollow}
                username={username}
                viewerIsFollowing={viewerIsFollowing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ProfilePageBanner.defaultProps = {
  profile: {},
  canFollow: { value: false },
  canUnfollow: { value: false },
  followersCount: 0,
  viewerIsFollowing: false,
  isViewer: false
};

ProfilePageBanner.propTypes = {
  canFollow: PropTypes.shape({ value: PropTypes.bool }),
  canUnfollow: PropTypes.shape({ value: PropTypes.bool }),
  followersCount: PropTypes.number,
  isViewer: PropTypes.bool,
  profile: PropTypes.shape({
    imageUrl: PropTypes.string,
    bio: PropTypes.string
  }),
  username: PropTypes.string.isRequired,
  viewerIsFollowing: PropTypes.bool,
  onFollow: PropTypes.func.isRequired,
  onUnfollow: PropTypes.func.isRequired
};
