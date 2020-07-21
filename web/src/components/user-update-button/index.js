import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { gql } from '@apollo/client';

export function UserUpdateButton({ canUpdate }) {
  if (canUpdate.value === false) return null;

  return (
    <Link href="/settings">
      <a className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a" /> Edit Profile Settings
      </a>
    </Link>
  );
}

UserUpdateButton.fragments = {
  user: gql`
    fragment UserUpdateButtonUserFragment on User {
      canUpdate {
        value
      }
    }
  `,
};

UserUpdateButton.defaultProps = {
  canUpdate: { value: false },
};

UserUpdateButton.propTypes = {
  canUpdate: PropTypes.shape({ value: PropTypes.bool }),
};
