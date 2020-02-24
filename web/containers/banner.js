import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { ArticleMeta } from './article-meta';

export function Banner(props) {
  const banner = useQuery(BannerQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      slug: props.slug
    },
    skip: typeof props.slug !== 'string'
  });
  return (
    <div className="banner">
      <div className="container">
        <h1>{banner.data?.article?.title ?? 'Loading...'}</h1>
        <ArticleMeta slug={props.slug} />
      </div>
    </div>
  );
}

Banner.propTypes = {
  slug: PropTypes.string.isRequired
};

Banner.fragments = {
  article: gql`
    fragment BannerArticleFragment on Article {
      ...ArticleMetaArticleFragment
      createdAt
      favoritesCount
      slug
      title
      author {
        followersCount
        profile {
          imageUrl
          username
        }
      }
    }
    ${ArticleMeta.fragments.article}
  `
};

const BannerQuery = gql`
  query BannerQuery($slug: String!) {
    article: articleBySlug(slug: $slug) {
      ...BannerArticleFragment
    }
  }
  ${Banner.fragments.article}
`;
