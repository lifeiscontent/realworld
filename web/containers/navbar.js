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
    <Link href={props.href} as={props.as} shallow={props.shallow}>
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
  shallow: PropTypes.bool,
  children: PropTypes.node.isRequired
};

const NavbarQuery = gql`
  query NavBarQuery {
    viewer {
      id
      profile {
        id
        username
      }
    }
  }
`;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navbar = useQuery(NavbarQuery);
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link href="/" as="/" shallow>
          <a className="navbar-brand">conduit</a>
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          {navbar.data?.viewer ? (
            <>
              <li className="nav-item">
                <NavLink href="/editor" as="/editor" shallow>
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
                  {navbar.data?.viewer?.profile?.username ?? 'Loading...'}
                </a>
                <div
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <Link
                    href={`/${navbar.data?.viewer?.profile?.username}`}
                    as={`/${navbar.data?.viewer?.profile?.username}`}
                    shallow
                  >
                    <a className="dropdown-item" onClick={() => setOpen(false)}>
                      Profile
                    </a>
                  </Link>
                  <Link href="/settings" as="/settings" shallow>
                    <a className="dropdown-item" onClick={() => setOpen(false)}>
                      Settings
                    </a>
                  </Link>
                  <Link href="/" as="/" shallow>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        setOpen(false);
                        localStorage.removeItem('token');
                      }}
                    >
                      Logout
                    </a>
                  </Link>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink href="/login" as="/login" shallow>
                  Sign in
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="/register" as="/register" shallow>
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
