import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export function ArticlePreviewTag(props) {
  const articlePreviewTag = useQuery(ArticlePreviewTagQuery, {
    fetchPolicy: 'cache-only',
    variables: { id: props.tagId }
  });

  if (articlePreviewTag.loading) return null;

  return (
    <li className="tag-pill tag-default">{articlePreviewTag.data.tag.name}</li>
  );
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
