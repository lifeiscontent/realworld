import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export function ArticleUpdateButton(props) {
  return (
    <Link href="/editor/[slug]" as={`/editor/${props.slug}`}>
      <a className="btn btn-sm btn-outline-secondary">
        <i className="ion-edit" /> Edit Article
      </a>
    </Link>
  );
}

ArticleUpdateButton.propTypes = {
  slug: PropTypes.string.isRequired
};
