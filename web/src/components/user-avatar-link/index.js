import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { UserAvatar } from '../user-avatar';
import { gql } from '@apollo/client';

export function UserAvatarLink({ profile, username }) {
  return (
    <Link href="/user/[username]" as={`/user/${username}`}>
      <a>
        <UserAvatar profile={profile} username={username} />
      </a>
    </Link>
  );
}

UserAvatarLink.fragments = {
  user: gql`
    fragment UserAvatarLinkUserFragment on User {
      username
      ...UserAvatarUserFragment
    }
    ${UserAvatar.fragments.user}
  `,
};

UserAvatarLink.propTypes = {
  profile: PropTypes.object,
  username: PropTypes.string.isRequired,
};
