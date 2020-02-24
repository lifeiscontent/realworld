import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export function TagsInputTag(props) {
  const tag = useQuery(TagsInputTagQuery, {
    variables: {
      id: props.id
    },
    fetchPolicy: 'cache-only'
  });

  return (
    <span className="tag-default tag-pill">
      <i className="ion-close-round" />
      {tag.data.tag.name}
    </span>
  );
}

TagsInputTag.propTypes = {
  id: PropTypes.string.isRequired
};

TagsInputTag.fragments = {
  tag: gql`
    fragment TagsInputTagTagFragment on Tag {
      id
      name
    }
  `
};

const TagsInputTagQuery = gql`
  query TagsInputTagQuery($id: ID!) {
    tag(id: $id) {
      ...TagsInputTagTagFragment
    }
  }
  ${TagsInputTag.fragments.tag}
`;
