import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

export function ArticleDeleteButton({ canDelete, onDelete, slug }) {
  const handleDelete = useCallback(
    event => {
      event.preventDefault();
      onDelete({ variables: { slug } });
    },
    [onDelete, slug]
  );

  if (canDelete.value === false) return null;

  return (
    <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
      <i className="ion-trash-a" /> Delete Article
    </button>
  );
}

ArticleDeleteButton.fragments = {
  article: gql`
    fragment ArticleDeleteButtonArticleFragment on Article {
      canDelete {
        value
      }
      slug
    }
  `
};

ArticleDeleteButton.defaultProps = {
  canDelete: { value: false }
};

ArticleDeleteButton.propTypes = {
  canDelete: PropTypes.shape({ value: PropTypes.bool }),
  onDelete: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired
};
