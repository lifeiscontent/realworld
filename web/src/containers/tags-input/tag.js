import PropTypes from 'prop-types';
import { gql, useQuery, NetworkStatus } from '@apollo/client';

export function TagsInputTag({ id, onRemoveTag }) {
  const component = useQuery(TagsInputTagQuery, {
    variables: {
      id,
    },
  });

  if (
    component.networkStatus === NetworkStatus.loading ||
    component.networkStatus === NetworkStatus.setVariables
  )
    return null;

  return (
    <span className="tag-default tag-pill">
      <i
        className="ion-close-round"
        onClick={() => onRemoveTag(component.data.tag)}
      />
      {component.data.tag.name}
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
