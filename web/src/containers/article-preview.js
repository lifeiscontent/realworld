import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Link from 'next/link';
import { ArticlePreviewTag } from './article-preview-tag';
import { format } from '../utils/date';
import { FavoriteArticleButton } from '../components/favorite-article-button';

export function ArticlePreview(props) {
  const articlePreview = useQuery(ArticlePreviewQuery, {
    fetchPolicy: 'cache-only',
    variables: { slug: props.articleSlug }
  });

  const [favoriteArticle] = useMutation(ArticlePreviewFavoriteArticleMutation, {
    variables: {
      slug: props.articleSlug
    }
  });

  const [unfavoriteArticle] = useMutation(
    ArticlePreviewUnfavoriteArticleMutation,
    {
      variables: {
        slug: props.articleSlug
      },
      update: props.onUnfavoriteArticle
    }
  );

  const handleFavoriting = useCallback(
    event => {
      event.preventDefault();
      if (articlePreview.data.article.viewerDidFavorite) {
        unfavoriteArticle();
      } else {
        favoriteArticle();
      }
    },
    [
      articlePreview.data.article.viewerDidFavorite,
      favoriteArticle,
      unfavoriteArticle
    ]
  );

  if (articlePreview.loading) return null;

  const canChangeFavorite =
    (articlePreview.data.article.canFavorite.value &&
      articlePreview.data.article.canUnfavorite.value) ||
    false;

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
        {canChangeFavorite ? (
          <div className="pull-xs-right">
            <FavoriteArticleButton
              pressed={articlePreview.data.article.viewerDidFavorite ?? false}
              onClick={handleFavoriting}
            >
              {articlePreview.data.article.favoritesCount ?? 0}
            </FavoriteArticleButton>
          </div>
        ) : null}
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
      favoritesCount
      slug
      title
      viewerDidFavorite
      tags {
        ...ArticlePreviewTagTagFragment
      }
      canFavorite {
        value
      }
      canUnfavorite {
        value
      }
      author {
        username
        profile {
          imageUrl
        }
      }
    }
    ${ArticlePreviewTag.fragments.tag}
  `
};

const ArticlePreviewQuery = gql`
  query ArticlePreviewQuery($slug: ID!) {
    article: articleBySlug(slug: $slug) {
      ...ArticlePreviewArticleFragment
    }
  }
  ${ArticlePreview.fragments.article}
`;

const ArticlePreviewFavoriteArticleMutation = gql`
  mutation ArticlePreviewFavoriteArticleMutation($slug: ID!) {
    favoriteArticle(slug: $slug) {
      article {
        ...ArticlePreviewArticleFragment
      }
    }
  }
  ${ArticlePreview.fragments.article}
`;

const ArticlePreviewUnfavoriteArticleMutation = gql`
  mutation ArticlePreviewUnfavoriteArticleMutation($slug: ID!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...ArticlePreviewArticleFragment
      }
    }
  }
  ${ArticlePreview.fragments.article}
`;
