import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

export function ArticlePreviewTag(props) {
  const tag = useQuery(ArticlePreviewTagQuery, {
    variables: { id: props.id }
  });
  return tag.loading ? (
    <li className="tag-pill tag-default">Loading...</li>
  ) : (
    <li className="tag-default tag-pill tag-outline">{tag.data.tag.name}</li>
  );
}

ArticlePreviewTag.fragments = {
  tag: gql`
    fragment ArticlePreviewTagTagFragment on Tag {
      id
      name
    }
  `
};

const ArticlePreviewTagQuery = gql`
  query ArticlePreviewTagQuery($id: ID!) {
    tag(id: $id) {
      ...ArticlePreviewTagTagFragment
    }
  }
  ${ArticlePreviewTag.fragments.tag}
`;
