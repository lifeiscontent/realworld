import PropTypes from 'prop-types';
import { gql } from '@apollo/client';

export function ArticleDeleteButton({ canDelete, onDelete, slug }) {
  const handleDelete = event => {
    event.preventDefault();
    onDelete({ variables: { slug } });
  };

  if (!canDelete?.value) return null;

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
  `,
};

ArticleDeleteButton.propTypes = {
  canDelete: PropTypes.shape({ value: PropTypes.bool }),
  onDelete: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
};
