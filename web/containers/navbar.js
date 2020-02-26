import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

function NavLink(props) {
  const router = useRouter();

  return (
    <Link href={props.href} as={props.as}>
      <a
        className={clsx('nav-link', {
          active: router.pathname === props.href
        })}
      >
        {props.children}
      </a>
    </Link>
  );
}

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  as: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

const NavbarQuery = gql`
  query NavBarQuery {
    viewer {
      id
      profile {
        username
      }
    }
  }
`;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navbar = useQuery(NavbarQuery);
  if (navbar.loading) return null;

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link href="/" as="/">
          <a className="navbar-brand">conduit</a>
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          {navbar.data.viewer ? (
            <>
              <li className="nav-item">
                <NavLink href="/editor" as="/editor">
                  <i className="ion-compose" />
                  &nbsp;New Post
                </NavLink>
              </li>
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
                  {navbar.data.viewer.profile.username}
                </a>
                <div
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <Link
                    href={`/[username]`}
                    as={`/${navbar.data.viewer.profile.username}`}
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
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink href="/login" as="/login">
                  Sign in
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="/register" as="/register">
                  Sign up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
