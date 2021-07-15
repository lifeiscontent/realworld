import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import Image from 'next/image';

export function UserAvatar({ profile, username, size }) {
  return (
    <Image
      width={size}
      height={size}
      src={profile.imageUrl ?? '/images/smiley-cyrus.jpg'}
      alt={`Image of ${username}`}
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

UserAvatar.defaultProps = {
  profile: {},
};

UserAvatar.propTypes = {
  profile: PropTypes.shape({ imageUrl: PropTypes.string }),
  username: PropTypes.string.isRequired,
  size: PropTypes.string,
};
