import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Link from 'next/link';

export function NavbarUserDropdown({ username }) {
  const [open, setOpen] = React.useState(false);

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
        {username}
      </a>
      <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
        <Link
          href={`/user/${username}`}
          className="dropdown-item"
          onClick={() => setOpen(false)}
        >
          Profile
        </Link>
        <Link
          href="/settings"
          className="dropdown-item"
          onClick={() => setOpen(false)}
        >
          Settings
        </Link>
        <Link
          href="/logout"
          className="dropdown-item"
          onClick={() => setOpen(false)}
        >
          Logout
        </Link>
      </div>
    </li>
  );
}

NavbarUserDropdown.propTypes = {
  username: PropTypes.string.isRequired,
};
