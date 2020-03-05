import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Link from 'next/link';
import { ArticlePreviewTagList } from './article-preview-tag-list';
import { FavoriteArticleButton } from '../components/favorite-article-button';

import { ArticleMetaInfo } from '../components/article-meta-info';
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
    [articlePreview.data, favoriteArticle, unfavoriteArticle]
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
        <ArticleMetaInfo
          userUsername={articlePreview.data.article.author.username}
          articleCreatedAt={articlePreview.data.article.createdAt}
        />
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
          <ArticlePreviewTagList tags={articlePreview.data.article.tags} />
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
      ...ArticlePreviewTagListArticleFragment
    }
    ${ArticlePreviewTagList.fragments.article}
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
