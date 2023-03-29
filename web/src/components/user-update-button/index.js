import PropTypes from 'prop-types';
import Link from 'next/link';
import { gql } from '@apollo/client';

export function UserUpdateButton({ canUpdate = { value: false } }) {
  if (!canUpdate?.value) return null;

  return (
    <Link
      href="/settings"
      className="btn btn-sm action-btn btn-outline-secondary"
    >
      <i className="ion-gear-a" />
      Edit Profile Settings
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

UserUpdateButton.propTypes = {
  canUpdate: PropTypes.shape({ value: PropTypes.bool }),
};
