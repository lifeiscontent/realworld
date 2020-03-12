import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

export function ArticleDeleteButton({ onDelete, slug }) {
  const handleDelete = useCallback(
    event => {
      event.preventDefault();
      onDelete({ variables: { slug } });
    },
    [onDelete, slug]
  );

  return (
    <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
      <i className="ion-trash-a" /> Delete Article
    </button>
  );
}

ArticleDeleteButton.propTypes = {
  onDelete: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired
};
