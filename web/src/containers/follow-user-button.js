import React from 'react';
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

  if (followButton.loading) return null;

  const isActionable =
    (followButton.data.user.canFollow.value ||
      followButton.data.user.canUnfollow.value) ??
    false;

  const viewerIsFollowing = followButton.data.user.viewerIsFollowing;

  return isActionable ? (
    <button
      className={clsx('btn btn-sm action-btn', {
        'btn-outline-secondary': (viewerIsFollowing ?? false) === false,
        'btn-secondary': viewerIsFollowing ?? false
      })}
      onClick={event => {
        event.preventDefault();

        if (typeof viewerIsFollowing === 'boolean') {
          if (viewerIsFollowing) {
            unfollowUser();
          } else {
            followUser();
          }
        }
      }}
    >
      <i className="ion-plus-round" /> {actionName(viewerIsFollowing)}{' '}
      {props.userUsername}
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
