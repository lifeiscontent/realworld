import { href, Link, NavLink } from 'react-router';

import { Avatar } from '../ui/Avatar';

interface NavbarProps {
  viewer: { username: string; image?: string | null } | null;
}

export function Navbar({ viewer }: NavbarProps) {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to={href('/')}>
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <NavLink className="nav-link" to={href('/')} end>
              Home
            </NavLink>
          </li>
          {viewer ? (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to={href('/editor/:slug?')} end>
                  <i className="ion-compose" />
                  &nbsp;New Article
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={href('/settings')}>
                  <i className="ion-gear-a" />
                  &nbsp;Settings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to={href('/profile/:username/:tab?', {
                    username: viewer.username,
                  })}
                >
                  <Avatar
                    className="user-pic"
                    decorative
                    name={viewer.username}
                    image={viewer.image}
                  />
                  {viewer.username}
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to={href('/login')}>
                  Sign in
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={href('/register')}>
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
