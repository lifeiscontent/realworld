import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Link from "next/link";
import clsx from "clsx";
import gql from "graphql-tag";
import { useRouter } from "next/router";

const TagQuery = gql`
  query TagQuery($id: ID!) {
    tag(id: $id) {
      id
      name
    }
  }
`;

export function Tag(props) {
  const router = useRouter();
  const tag = useQuery(TagQuery, {
    variables: { id: props.id }
  });
  return tag.loading ? (
    <span className="tag-pill tag-default">Loading...</span>
  ) : (
    <Link
      href={{
        pathname: "/",
        query: { tagName: tag.data.tag.name }
      }}
    >
      <a
        className={clsx("tag-pill tag-default", {
          "tag-outline": router.query.tagName === tag.data.tag.name
        })}
      >
        {tag.data.tag.name}
      </a>
    </Link>
  );
}
