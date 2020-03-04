import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { ArticleMeta } from './article-meta';

export function Banner(props) {
  const banner = useQuery(BannerQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      slug: props.articleSlug
    }
  });

  if (banner.loading) return null;

  return (
    <div className="banner">
      <div className="container">
        <h1>{banner.data.article.title}</h1>
        <ArticleMeta articleSlug={props.articleSlug} />
      </div>
    </div>
  );
}

Banner.propTypes = {
  articleSlug: PropTypes.string.isRequired
};

Banner.fragments = {
  article: gql`
    fragment BannerArticleFragment on Article {
      slug
      title
      ...ArticleMetaArticleFragment
    }
    ${ArticleMeta.fragments.article}
  `
};

const BannerQuery = gql`
  query BannerQuery($slug: ID!) {
    article: articleBySlug(slug: $slug) {
      ...BannerArticleFragment
    }
  }
  ${Banner.fragments.article}
`;
