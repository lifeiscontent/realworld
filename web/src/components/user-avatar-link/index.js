import PropTypes from 'prop-types';
import Link from 'next/link';
import { UserAvatar } from '../user-avatar';
import { gql } from '@apollo/client';

export function UserAvatarLink({ profile, username, size }) {
  return (
    <Link href={`/user/${username}`}>
      <UserAvatar size={size} profile={profile} username={username} />
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
  size: PropTypes.string,
};
