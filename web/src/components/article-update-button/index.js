import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export function ArticleUpdateButton({ canUpdate, slug }) {
  if (canUpdate.value === false) return null;

  return (
    <Link href="/editor/[slug]" as={`/editor/${slug}`}>
      <a className="btn btn-sm btn-outline-secondary">
        <i className="ion-edit" /> Edit Article
      </a>
    </Link>
  );
}

ArticleUpdateButton.defaultProps = {
  canUpdate: { value: false }
};

ArticleUpdateButton.propTypes = {
  canUpdate: PropTypes.shape({ value: PropTypes.bool }),
  slug: PropTypes.string.isRequired
};
