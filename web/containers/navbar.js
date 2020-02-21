import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

function NavLink(props) {
  const router = useRouter();

  return (
    <Link href={props.href} as={props.as} shallow={props.shallow}>
      <a
        className={clsx("nav-link", {
          active: router.pathname === props.href
        })}
      >
        {props.children}
      </a>
    </Link>
  );
}

const NavbarQuery = gql`
  query NavBarQuery {
    viewer {
      id
    }
  }
`;

export function Navbar(props) {
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
              <li className="nav-item">
                <NavLink href="/settings" as="/settings" shallow>
                  <i className="ion-gear-a" />
                  &nbsp;Settings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="/" as="/" shallow>
                  Logout
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink href="/register" as="/login" shallow>
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
