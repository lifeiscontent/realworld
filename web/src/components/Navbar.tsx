import { Link, NavLink } from 'react-router';
import { UserAvatar } from './UserAvatar';
import { paths } from '../lib/paths';

interface NavbarProps {
  viewer: { username: string; image?: string | null } | null;
}

export function Navbar({ viewer }: NavbarProps) {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <NavLink className="nav-link" to="/" end>
              Home
            </NavLink>
          </li>
          {viewer ? (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/editor" end>
                  <i className="ion-compose" />
                  &nbsp;New Article
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/settings">
                  <i className="ion-gear-a" />
                  &nbsp;Settings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to={paths.profile(viewer.username)}
                >
                  <UserAvatar
                    className="user-pic"
                    decorative
                    username={viewer.username}
                    image={viewer.image}
                  />
                  {viewer.username}
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  Sign in
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/register">
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
