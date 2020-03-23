import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { NetworkStatus } from 'apollo-client';

export function TagsInputTag({ id, onRemoveTag }) {
  const tagInputTag = useQuery(TagsInputTagQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      id,
    },
  });

  if (
    tagInputTag.networkStatus === NetworkStatus.loading ||
    tagInputTag.networkStatus === undefined
  )
    return null;

  return (
    <span className="tag-default tag-pill">
      <i
        className="ion-close-round"
        onClick={() => onRemoveTag(tagInputTag.data.tag)}
      />
      {tagInputTag.data.tag.name}
    </span>
  );
}

TagsInputTag.propTypes = {
  id: PropTypes.string.isRequired,
  onRemoveTag: PropTypes.func.isRequired,
};

TagsInputTag.fragments = {
  tag: gql`
    fragment TagsInputTagTagFragment on Tag {
      id
      name
    }
  `,
};

const TagsInputTagQuery = gql`
  query TagsInputTagQuery($id: ID!) {
    tag(id: $id) {
      ...TagsInputTagTagFragment
    }
  }
  ${TagsInputTag.fragments.tag}
`;
