import PropTypes from 'prop-types';
import Link from 'next/link';
import { gql } from '@apollo/client';

export function ArticleUpdateButton({ canUpdate, slug }) {
  if (!canUpdate?.value) return null;

  return (
    <Link href={`/editor/${slug}`} className="btn btn-sm btn-outline-secondary">
      <i className="ion-edit" />
      Edit Article
    </Link>
  );
}

ArticleUpdateButton.fragments = {
  article: gql`
    fragment ArticleUpdateButtonArticleFragment on Article {
      canUpdate {
        value
      }
      slug
    }
  `,
};

ArticleUpdateButton.propTypes = {
  canUpdate: PropTypes.shape({ value: PropTypes.bool }),
  slug: PropTypes.string.isRequired,
};
