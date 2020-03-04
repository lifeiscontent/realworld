import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import clsx from 'clsx';

function actionName(viewerIsFollowing) {
  switch (viewerIsFollowing) {
    case true:
      return 'Unfollow';
    case false:
      return 'Follow';
    default:
      return '';
  }
}

export function FollowUserButton(props) {
  const followButton = useQuery(FollowUserButtonQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      username: props.userUsername
    }
  });

  const [followUser] = useMutation(FollowUserButtonFollowUserMutation, {
    variables: { username: props.userUsername }
  });

  const [unfollowUser] = useMutation(FollowUserButtonUnfollowUserMutation, {
    variables: { username: props.userUsername }
  });

  const handleClick = useCallback(
    event => {
      event.preventDefault();

      if (followButton.data.user.viewerIsFollowing) {
        unfollowUser();
      } else {
        followUser();
      }
    },
    [followButton.data, followUser, unfollowUser]
  );

  if (followButton.loading) return null;

  const isActionable =
    (followButton.data.user.canFollow.value ||
      followButton.data.user.canUnfollow.value) ??
    false;

  const viewerIsFollowing = followButton.data.user.viewerIsFollowing;
  const buttonIsPressed = viewerIsFollowing ?? false;

  return isActionable ? (
    <button
      className={clsx('btn btn-sm action-btn', {
        'btn-outline-secondary': buttonIsPressed === false,
        'btn-secondary': buttonIsPressed
      })}
      onClick={handleClick}
    >
      <i className="ion-plus-round" /> {actionName(viewerIsFollowing)}{' '}
      {props.userUsername} ({followButton.data.user.followersCount})
    </button>
  ) : null;
}

FollowUserButton.propTypes = {
  userUsername: PropTypes.string.isRequired
};

FollowUserButton.fragments = {
  user: gql`
    fragment FollowUserButtonUserFragment on User {
      username
      viewerIsFollowing
      followersCount
      canFollow {
        value
      }
      canUnfollow {
        value
      }
    }
  `
};

const FollowUserButtonQuery = gql`
  query FollowUserButtonQuery($username: ID!) {
    user: userByUsername(username: $username) {
      ...FollowUserButtonUserFragment
    }
  }
  ${FollowUserButton.fragments.user}
`;

const FollowUserButtonFollowUserMutation = gql`
  mutation FollowUserButtonFollowUserMutation($username: ID!) {
    followUser(username: $username) {
      user {
        ...FollowUserButtonUserFragment
      }
    }
  }
  ${FollowUserButton.fragments.user}
`;

const FollowUserButtonUnfollowUserMutation = gql`
  mutation FollowUserButtonUnfollowUserMutation($username: ID!) {
    unfollowUser(username: $username) {
      user {
        ...FollowUserButtonUserFragment
      }
    }
  }
  ${FollowUserButton.fragments.user}
`;
