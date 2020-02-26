import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export function ArticlePreviewTag(props) {
  const tag = useQuery(ArticlePreviewTagQuery, {
    fetchPolicy: 'cache-only',
    variables: { id: props.tagId }
  });

  if (tag.loading) return null;

  return <li className="tag-pill tag-default">{tag.data.tag.name}</li>;
}

ArticlePreviewTag.propTypes = {
  tagId: PropTypes.string.isRequired
};

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
