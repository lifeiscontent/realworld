import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import Image from 'next/image';

export function UserAvatar({ profile, username, size }) {
  return (
    <Image
      alt={`Image of ${username}`}
      height={size}
      src={profile?.imageUrl ?? '/images/smiley-cyrus.jpg'}
      unoptimized={!!profile?.imageUrl}
      priority
      width={size}
    />
  );
}

UserAvatar.fragments = {
  user: gql`
    fragment UserAvatarUserFragment on User {
      username
      profile {
        imageUrl
      }
    }
  `,
};

UserAvatar.propTypes = {
  profile: PropTypes.shape({ imageUrl: PropTypes.string }),
  username: PropTypes.string.isRequired,
  size: PropTypes.string,
};
