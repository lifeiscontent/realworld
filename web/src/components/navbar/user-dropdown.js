import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Link from 'next/link';

export function NavbarUserDropdown({ username }) {
  const [open, setOpen] = useState(false);

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
        <Link href="/[username]" as={`/${username}`}>
          <a className="dropdown-item" onClick={() => setOpen(false)}>
            Profile
          </a>
        </Link>
        <Link href="/settings">
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
  username: PropTypes.string.isRequired
};
