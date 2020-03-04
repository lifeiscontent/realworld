import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { FollowUserButton } from './follow-user-button';

export function UserInfo(props) {
  const userInfo = useQuery(UserInfoQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      username: props.userUsername
    }
  });

  if (userInfo.loading) return null;

  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <img
              src={
                userInfo.data.user.profile.imageUrl ??
                '/images/smiley-cyrus.jpg'
              }
              className="user-img"
              alt={`Image of ${userInfo.data.user.username}`}
            />
            <h4>{props.userUsername}</h4>
            <p>{userInfo.data.user.profile.bio}</p>
            <div className="btn-toolbar">
              {userInfo.data.user.canUpdate.value ? (
                <Link href="/settings" as="/settings">
                  <a className="btn btn-sm btn-outline-secondary action-btn">
                    <i className="ion-gear-a" />
                    &nbsp; Edit Profile Settings
                  </a>
                </Link>
              ) : null}{' '}
              <FollowUserButton userUsername={props.userUsername} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

UserInfo.propTypes = {
  userUsername: PropTypes.string.isRequired
};

UserInfo.fragments = {
  user: gql`
    fragment UserInfoUserFragment on User {
      ...FollowUserButtonUserFragment
      username
      canUpdate {
        value
      }
      profile {
        imageUrl
        bio
      }
    }
    ${FollowUserButton.fragments.user}
  `
};

const UserInfoQuery = gql`
  query UserInfoQuery($username: ID!) {
    user: userByUsername(username: $username) {
      ...UserInfoUserFragment
    }
  }
  ${UserInfo.fragments.user}
`;
