import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { FollowButton } from './follow-button';

export function UserInfo(props) {
  const userInfo = useQuery(UserInfoQuery, {
    variables: {
      username: props.username
    },
    fetchPolicy: 'cache-only',
    skip: typeof props.username !== 'string'
  });

  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <img
              src={
                userInfo.data?.profile?.imageUrl ?? '/images/smiley-cyrus.jpg'
              }
              className="user-img"
            />
            <h4>{userInfo.data?.profile?.username ?? 'Loading...'}</h4>
            <p>{userInfo.data?.profile?.bio}</p>
            <div className="btn-toolbar">
              {userInfo.data?.profile?.user?.canUpdate?.value ? (
                <Link href="/settings" as="/settings" shallow>
                  <a className="btn btn-sm btn-outline-secondary action-btn">
                    <i className="ion-gear-a" />
                    &nbsp; Edit Profile Settings
                  </a>
                </Link>
              ) : null}{' '}
              <FollowButton username={userInfo.data?.profile?.username} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

UserInfo.propTypes = {
  username: PropTypes.string.isRequired
};

UserInfo.fragments = {
  profile: gql`
    fragment UserInfoProfileFragment on Profile {
      ...FollowButtonProfileFragment
      imageUrl
      username
      bio
      user {
        canUpdate {
          value
        }
      }
    }
    ${FollowButton.fragments.profile}
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
