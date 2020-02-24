import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Link from 'next/link';
import { format } from '../utils/date';
import { ArticlePreviewTag } from './article-preview-tag';
import { ArticlePreviewFavoriteButton } from './article-preview-favorite-button';

export function ArticlePreview(props) {
  const article = useQuery(ArticlePreviewQuery, {
    variables: { slug: props.slug },
    fetchPolicy: 'cache-only'
  });

  return article.loading ? (
    <div className="article-preview">Loading...</div>
  ) : (
    <div className="article-preview">
      <div className="article-meta">
        <Link
          href="/[username]"
          as={`/${article.data.article.author.profile.username}`}
          shallow
        >
          <a>
            <img
              src={
                article.data.article.author.profile.imageUrl ??
                '/images/smiley-cyrus.jpg'
              }
            />
          </a>
        </Link>
        <div className="info">
          <Link
            href="/[username]"
            as={`/${article.data.article.author.profile.username}`}
            shallow
          >
            <a className="author">
              {article.data.article.author.profile.username}
            </a>
          </Link>
          <time dateTime={article.data.article.createdAt} className="date">
            {format(new Date(article.data.article.createdAt), 'MMMM Qo')}
          </time>
        </div>
        {article.data?.article?.slug ? (
          <ArticlePreviewFavoriteButton
            slug={article.data.article.slug}
            onUnfavorite={props.onUnfavorite}
          />
        ) : null}
      </div>
      <Link
        href="/article/[slug]"
        as={`/article/${article.data.article.slug}`}
        shallow
      >
        <a className="preview-link">
          <h1>{article.data.article.title}</h1>
          <p>{article.data.article.description}</p>
          <span>Read more...</span>
          {article.data.article.tags.length ? (
            <ul className="tag-list">
              {article.data.article.tags.map(tag => (
                <ArticlePreviewTag key={tag.id} id={tag.id} />
              ))}
            </ul>
          ) : null}
        </a>
      </Link>
    </div>
  );
}

ArticlePreview.propTypes = {
  slug: PropTypes.string.isRequired,
  onUnfavorite: PropTypes.func
};

ArticlePreview.fragments = {
  article: gql`
    fragment ArticlePreviewArticleFragment on Article {
      createdAt
      description
      slug
      title
      tags {
        ...ArticlePreviewTagTagFragment
      }
      author {
        profile {
          imageUrl
          username
        }
      }
      ...ArticlePreviewFavoriteButtonArticleFragment
    }
    ${ArticlePreviewTag.fragments.tag}
    ${ArticlePreviewFavoriteButton.fragments.article}
  `
};

const ArticlePreviewQuery = gql`
  query ArticlePreviewQuery($slug: String!) {
    article: articleBySlug(slug: $slug) {
      ...ArticlePreviewArticleFragment
    }
  }
  ${ArticlePreview.fragments.article}
`;
