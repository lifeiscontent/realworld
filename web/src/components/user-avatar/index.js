import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';

export function UserAvatar({ profile, username }) {
  return (
    <img
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
};
