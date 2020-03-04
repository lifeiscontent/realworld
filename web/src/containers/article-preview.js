import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Link from 'next/link';
import { ArticlePreviewTag } from './article-preview-tag';
import { ArticlePreviewFavoriteButton } from './article-preview-favorite-button';
import { format } from '../utils/date';

export function ArticlePreview(props) {
  const articlePreview = useQuery(ArticlePreviewQuery, {
    fetchPolicy: 'cache-only',
    variables: { slug: props.articleSlug }
  });

  if (articlePreview.loading) return null;

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link
          href="/[username]"
          as={`/${articlePreview.data.article.author.username}`}
          shallow
        >
          <a>
            <img
              src={
                articlePreview.data.article.author.profile.imageUrl ??
                '/images/smiley-cyrus.jpg'
              }
              alt={`Image of ${articlePreview.data.article.author.username}`}
            />
          </a>
        </Link>
        <div className="info">
          <Link
            href="/[username]"
            as={`/${articlePreview.data.article.author.username}`}
            shallow
          >
            <a className="author">
              {articlePreview.data.article.author.username}
            </a>
          </Link>
          <time
            dateTime={articlePreview.data.article.createdAt}
            className="date"
          >
            {format(new Date(articlePreview.data.article.createdAt), 'MMMM Qo')}
          </time>
        </div>
        <ArticlePreviewFavoriteButton
          articleSlug={props.articleSlug}
          onUnfavoriteArticle={props.onUnfavoriteArticle}
        />
      </div>
      <Link href="/article/[slug]" as={`/article/${props.articleSlug}`}>
        <a className="preview-link">
          <h1>{articlePreview.data.article.title}</h1>
          <p>{articlePreview.data.article.description}</p>
          <span>Read more...</span>
          {articlePreview.data.article.tags.length ? (
            <ul className="tag-list">
              {articlePreview.data.article.tags.map(tag => (
                <ArticlePreviewTag key={tag.id} tagId={tag.id} />
              ))}
            </ul>
          ) : null}
        </a>
      </Link>
    </div>
  );
}

ArticlePreview.propTypes = {
  articleSlug: PropTypes.string.isRequired,
  onUnfavoriteArticle: PropTypes.func
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
      canFavorite {
        value
      }
      author {
        username
        profile {
          imageUrl
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
