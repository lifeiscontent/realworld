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
      username: props.profileUsername
    }
  });

  if (userInfo.loading) return null;

  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <img
              src={userInfo.data.profile.imageUrl ?? '/images/smiley-cyrus.jpg'}
              className="user-img"
            />
            <h4>{props.profileUsername}</h4>
            <p>{userInfo.data.profile.bio}</p>
            <div className="btn-toolbar">
              {userInfo.data.profile.user.canUpdate.value ? (
                <Link href="/settings" as="/settings">
                  <a className="btn btn-sm btn-outline-secondary action-btn">
                    <i className="ion-gear-a" />
                    &nbsp; Edit Profile Settings
                  </a>
                </Link>
              ) : null}{' '}
              <FollowUserButton profileUsername={props.profileUsername} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

UserInfo.propTypes = {
  profileUsername: PropTypes.string.isRequired
};

UserInfo.fragments = {
  profile: gql`
    fragment UserInfoProfileFragment on Profile {
      ...FollowUserButtonProfileFragment
      imageUrl
      username
      bio
      user {
        id
        canUpdate {
          value
        }
      }
    }
    ${FollowUserButton.fragments.profile}
  `
};

const UserInfoQuery = gql`
  query UserInfoQuery($username: String!) {
    profile: profileByUsername(username: $username) {
      ...UserInfoProfileFragment
    }
  }
  ${UserInfo.fragments.profile}
`;
