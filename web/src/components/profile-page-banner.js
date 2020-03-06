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

export function ProfilePageBanner(props) {
  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <img
              src={
                typeof props.profile.imageUrl === 'string'
                  ? props.profile.imageUrl
                  : '/images/smiley-cyrus.jpg'
              }
              className="user-img"
              alt={`Image of ${props.username}`}
            />
            <h4>{props.username}</h4>
            <p />
            <div className="btn-toolbar">
              {props.isViewer ? (
                <Link href="/settings">
                  <a className="btn btn-sm btn-outline-secondary action-btn">
                    <i className="ion-gear-a" /> Edit Profile Settings
                  </a>
                </Link>
              ) : null}
              {props.canFollow.value && props.canUnfollow.value ? (
                <button
                  className={clsx('btn btn-sm action-btn', {
                    'btn-secondary': props.viewerIsFollowing === false,
                    'btn-outline-secondary': props.viewerIsFollowing
                  })}
                  onClick={() =>
                    props.viewerIsFollowing
                      ? props.onUnfollow({
                          variables: { username: props.username }
                        })
                      : props.onFollow({
                          variables: { username: props.username }
                        })
                  }
                >
                  <i className="ion-plus-round" />{' '}
                  {actionName(props.viewerIsFollowing)} {props.username} (
                  {props.followersCount})
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
  profile: PropTypes.shape({ imageUrl: PropTypes.string }),
  username: PropTypes.string.isRequired,
  viewerIsFollowing: PropTypes.bool,
  onFollow: PropTypes.func.isRequired,
  onUnfollow: PropTypes.func.isRequired
};
