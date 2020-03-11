import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import { NavbarUserDropdown } from './navbar-user-dropdown';

function NavLink({ href, as, children }) {
  const router = useRouter();

  return (
    <Link href={href} as={as}>
      <a
        className={clsx('nav-link', {
          active: router.pathname === href
        })}
      >
        {children}
      </a>
    </Link>
  );
}

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  as: PropTypes.string,
  children: PropTypes.node.isRequired
};

export function Navbar({ userUsername }) {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand">conduit</a>
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          {userUsername ? (
            <>
              <li className="nav-item">
                <NavLink href="/editor">
                  <i className="ion-compose" />
                  &nbsp;New Post
                </NavLink>
              </li>
              <NavbarUserDropdown userUsername={userUsername} />
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink href="/login">Sign in</NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="/register">Sign up</NavLink>
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
