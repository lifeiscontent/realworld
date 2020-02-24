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

export function FollowButton(props) {
  const followButton = useQuery(FollowButtonQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      username: props.username
    },
    skip: typeof props.username !== 'string'
  });

  const [followUser] = useMutation(FollowButtonFollowUserMutation, {
    variables: { id: followButton.data?.profile?.user?.id }
  });

  const [unfollowUser] = useMutation(FollowButtonUnfollowUserMutation, {
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

FollowButton.propTypes = {
  username: PropTypes.string.isRequired
};

const userFragment = gql`
  fragment FollowButtonUserFragment on User {
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

FollowButton.fragments = {
  profile: gql`
    fragment FollowButtonProfileFragment on Profile {
      username
      user {
        ...FollowButtonUserFragment
      }
    }
    ${userFragment}
  `
};

const FollowButtonQuery = gql`
  query FollowButtonQuery($username: String!) {
    profile: profileByUsername(username: $username) {
      ...FollowButtonProfileFragment
    }
  }
  ${FollowButton.fragments.profile}
`;

const FollowButtonFollowUserMutation = gql`
  mutation FollowButtonFollowUserMutation($id: ID!) {
    followUser(id: $id) {
      user {
        ...FollowButtonUserFragment
      }
    }
  }
  ${userFragment}
`;

const FollowButtonUnfollowUserMutation = gql`
  mutation FollowButtonUnfollowUserMutation($id: ID!) {
    unfollowUser(id: $id) {
      user {
        ...FollowButtonUserFragment
      }
    }
  }
  ${userFragment}
`;
