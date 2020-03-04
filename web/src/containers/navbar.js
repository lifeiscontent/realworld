import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import { NavbarUserDropdown } from './navbar-user-dropdown';
import gql from 'graphql-tag';

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

export function Navbar(props) {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link href="/" as="/">
          <a className="navbar-brand">conduit</a>
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          {props.userUsername ? (
            <>
              <li className="nav-item">
                <NavLink href="/editor" as="/editor">
                  <i className="ion-compose" />
                  &nbsp;New Post
                </NavLink>
              </li>
              <NavbarUserDropdown userUsername={props.userUsername} />
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

Navbar.propTypes = {
  userUsername: PropTypes.string
};

Navbar.fragments = {
  user: gql`
    fragment NavbarUserFragment on User {
      ...NavbarUserDropdownUserFragment
    }
    ${NavbarUserDropdown.fragments.user}
  `
};
