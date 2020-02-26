import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Link from 'next/link';

export function NavbarUserDropdown(props) {
  const [open, setOpen] = useState(false);
  const navbarUserDropdown = useQuery(NavbarUserDropdownQuery, {
    fetchPolicy: 'cache-first',
    variables: {
      id: props.userId
    }
  });

  if (navbarUserDropdown.loading) return null;

  console.log(navbarUserDropdown.data, props.userId);

  return (
    <li className={clsx('nav-item dropdown', { open })}>
      <a
        className="nav-link dropdown-toggle"
        href="#"
        id="navbarDropdownMenuLink"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={event => {
          event.preventDefault();
          setOpen(!open);
        }}
      >
        {navbarUserDropdown.data.user.profile.username}
      </a>
      <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
        <Link
          href={`/[username]`}
          as={`/${navbarUserDropdown.data.user.profile.username}`}
        >
          <a className="dropdown-item" onClick={() => setOpen(false)}>
            Profile
          </a>
        </Link>
        <Link href="/settings" as="/settings">
          <a className="dropdown-item" onClick={() => setOpen(false)}>
            Settings
          </a>
        </Link>
        <button
          className="dropdown-item"
          onClick={async () => {
            setOpen(false);
            fetch('/api/logout', { method: 'POST' }).then(() => {
              window.location = '/';
            });
          }}
        >
          Logout
        </button>
      </div>
    </li>
  );
}

NavbarUserDropdown.propTypes = {
  userId: PropTypes.string.isRequired
};

NavbarUserDropdown.fragments = {
  user: gql`
    fragment NavbarUserDropdownUserFragment on User {
      id
      profile {
        username
      }
    }
  `
};

const NavbarUserDropdownQuery = gql`
  query NavBarQuery($id: ID!) {
    user(id: $id) {
      ...NavbarUserDropdownUserFragment
    }
  }
  ${NavbarUserDropdown.fragments.user}
`;
