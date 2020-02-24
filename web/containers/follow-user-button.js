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
      username: props.username
    },
    skip: typeof props.username !== 'string'
  });

  const [followUser] = useMutation(FollowUserButtonFollowUserMutation, {
    variables: { id: followButton.data?.profile?.user?.id }
  });

  const [unfollowUser] = useMutation(FollowUserButtonUnfollowUserMutation, {
    variables: { id: followButton.data?.profile?.user?.id }
  });

  const isActionable =
    (followButton.data?.profile?.user?.canFollow?.value ||
      followButton.data?.profile?.user?.canUnfollow?.value) ??
    false;

  const viewerIsFollowing = followButton.data?.profile?.user?.viewerIsFollowing;

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
      {props.username}
    </button>
  ) : null;
}

FollowUserButton.propTypes = {
  username: PropTypes.string.isRequired
};

const userFragment = gql`
  fragment FollowUserButtonUserFragment on User {
    id
    viewerIsFollowing
    canFollow {
      value
    }
    canUnfollow {
      value
    }
  }
`;

FollowUserButton.fragments = {
  profile: gql`
    fragment FollowUserButtonProfileFragment on Profile {
      username
      user {
        ...FollowUserButtonUserFragment
      }
    }
    ${userFragment}
  `
};

const FollowUserButtonQuery = gql`
  query FollowUserButtonQuery($username: String!) {
    profile: profileByUsername(username: $username) {
      ...FollowUserButtonProfileFragment
    }
  }
  ${FollowUserButton.fragments.profile}
`;

const FollowUserButtonFollowUserMutation = gql`
  mutation FollowUserButtonFollowUserMutation($id: ID!) {
    followUser(id: $id) {
      user {
        ...FollowUserButtonUserFragment
      }
    }
  }
  ${userFragment}
`;

const FollowUserButtonUnfollowUserMutation = gql`
  mutation FollowUserButtonUnfollowUserMutation($id: ID!) {
    unfollowUser(id: $id) {
      user {
        ...FollowUserButtonUserFragment
      }
    }
  }
  ${userFragment}
`;
