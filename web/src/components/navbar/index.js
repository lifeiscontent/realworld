import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import { NavbarUserDropdown } from './user-dropdown';

function NavLink({ href, children }) {
  const router = useRouter();

  return (
    <Link
      href={href}
      className={clsx('nav-link', {
        active: router.asPath === href,
      })}
    >
      {children}
    </Link>
  );
}

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export function Navbar({ username }) {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link href="/" className="navbar-brand">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          {username ? (
            <>
              <li className="nav-item">
                <NavLink href="/editor">
                  <i className="ion-compose" />
                  &nbsp;New Post
                </NavLink>
              </li>
              <NavbarUserDropdown username={username} />
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
  username: PropTypes.string,
};
