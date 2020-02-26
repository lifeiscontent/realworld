import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export function TagsInputTag(props) {
  const tag = useQuery(TagsInputTagQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      id: props.tagId
    }
  });

  const handleClick = useCallback(() => {
    props.onRemoveTag(tag.data.tag);
  }, [props, tag.data.tag]);

  return (
    <span className="tag-default tag-pill">
      <i className="ion-close-round" onClick={handleClick} />
      {tag.data.tag.name}
    </span>
  );
}

TagsInputTag.propTypes = {
  tagId: PropTypes.string.isRequired,
  onRemoveTag: PropTypes.func.isRequired
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
