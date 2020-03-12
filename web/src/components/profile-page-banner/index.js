import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Link from 'next/link';
import gql from 'graphql-tag';

function actionName(viewerIsFollowing) {
  switch (viewerIsFollowing) {
    case true:
      return 'Unfollow';
    default:
      return 'Follow';
  }
}

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
              {isViewer ? (
                <Link href="/settings">
                  <a className="btn btn-sm btn-outline-secondary action-btn">
                    <i className="ion-gear-a" /> Edit Profile Settings
                  </a>
                </Link>
              ) : null}
              {canFollow.value || canUnfollow.value ? (
                <button
                  className={clsx('btn btn-sm action-btn', {
                    'btn-outline-secondary': viewerIsFollowing === false,
                    'btn-secondary': viewerIsFollowing
                  })}
                  onClick={() =>
                    viewerIsFollowing
                      ? onUnfollow({
                          variables: { username: username }
                        })
                      : onFollow({
                          variables: { username: username }
                        })
                  }
                >
                  <i className="ion-plus-round" />{' '}
                  {actionName(viewerIsFollowing)} {username} ({followersCount})
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ProfilePageBanner.fragments = {
  user: gql`
    fragment ProfilePageBannerUserFragment on User {
      canFollow {
        value
      }
      canUnfollow {
        value
      }
      followersCount
      isViewer
      profile {
        imageUrl
        bio
      }
      username
      viewerIsFollowing
    }
  `
};

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
