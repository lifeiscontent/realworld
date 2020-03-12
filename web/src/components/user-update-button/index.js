import React from 'react';
import Link from 'next/link';

export function UserUpdateButton() {
  return (
    <Link href="/settings">
      <a className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a" /> Edit Profile Settings
      </a>
    </Link>
  );
}
