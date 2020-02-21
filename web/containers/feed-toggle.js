import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const FeedToggleQuery = gql`
  query FeedToggleQuery {
    viewer {
      id
    }
  }
`;

export function FeedToggle(props) {
  const router = useRouter();
  const feed = useQuery(FeedToggleQuery);
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          {feed.loading === false && feed.data.viewer ? (
            <Link href="/feed" as="/feed" shallow>
              <a
                className={clsx("nav-link", {
                  active: router.pathname === "/feed"
                })}
              >
                Your Feed
              </a>
            </Link>
          ) : (
            <span className="nav-link disabled">Your Feed</span>
          )}
        </li>
        <li className="nav-item">
          <Link href="/" as="/" shallow>
            <a
              className={clsx("nav-link", { active: router.pathname === "/" })}
            >
              Global Feed
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
