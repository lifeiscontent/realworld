import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export function UpdateArticleButton(props) {
  const updateArticleButton = useQuery(UpdateArticleButtonQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      slug: props.articleSlug
    }
  });

  if (updateArticleButton.loading) return null;

  const isActionable =
    updateArticleButton.data.article.canUpdate.value ?? false;

  return isActionable ? (
    <Link
      href="/editor/[slug]"
      as={`/editor/${updateArticleButton.data.article.slug}`}
    >
      <a className="btn btn-outline-secondary btn-sm">
        <i className="ion-edit"></i> Edit Article
      </a>
    </Link>
  ) : null;
}

UpdateArticleButton.propTypes = {
  articleSlug: PropTypes.string.isRequired
};

UpdateArticleButton.fragments = {
  article: gql`
    fragment UpdateArticleButtonArticleFragment on Article {
      slug
      canUpdate {
        value
      }
    }
  `
};

const UpdateArticleButtonQuery = gql`
  query UpdateArticleButtonQuery($slug: ID!) {
    article: articleBySlug(slug: $slug) {
      ...UpdateArticleButtonArticleFragment
    }
  }
  ${UpdateArticleButton.fragments.article}
`;
