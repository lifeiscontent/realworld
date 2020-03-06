import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Link from 'next/link';
import gql from 'graphql-tag';
import { UpdateArticleButton } from './update-article-button';
import { FollowUserButton } from './follow-user-button';
import { FavoriteArticleButton } from '../components/favorite-article-button';
import { DeleteArticleButton } from './delete-article-button';
import { format } from '../utils/date';

export function ArticleMeta(props) {
  const article = useQuery(ArticleMetaQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      slug: props.articleSlug
    }
  });

  const [favoriteArticle] = useMutation(ArticleMetaFavoriteArticleMutation, {
    variables: {
      slug: props.articleSlug
    }
  });

  const [unfavoriteArticle] = useMutation(
    ArticleMetaUnfavoriteArticleMutation,
    {
      variables: {
        slug: props.articleSlug
      }
    }
  );

  const handleFavoriting = useCallback(
    event => {
      event.preventDefault();
      if (article.data.article.viewerDidFavorite) {
        unfavoriteArticle();
      } else {
        favoriteArticle();
      }
    },
    [article.data, favoriteArticle, unfavoriteArticle]
  );

  if (article.loading) return null;

  const canChangeFavorite =
    (article.data.article.canFavorite.value &&
      article.data.article.canUnfavorite.value) ||
    false;

  const favoriteButton = canChangeFavorite ? (
    <FavoriteArticleButton
      pressed={article.data.article.viewerDidFavorite ?? false}
      onClick={handleFavoriting}
    >
      {actionName(article.data.article.viewerDidFavorite)} (
      {article.data.article.favoritesCount ?? 0})
    </FavoriteArticleButton>
  ) : null;

  return (
    <div className="article-meta">
      <Link href="/[username]" as={`/${article.data.article.author.username}`}>
        <a>
          <img
            src={
              article.data.article.author.profile.imageUrl ??
              '/images/smiley-cyrus.jpg'
            }
            alt={`Image of ${article.data.article.author.username}`}
          />
        </a>
      </Link>
      <div className="info">
        <Link
          href="/[username]"
          as={`/${article.data.article.author.username}`}
          shallow
        >
          <a className="author">{article.data.article.author.username}</a>
        </Link>
        <time dateTime={article.data.article.createdAt} className="date">
          {format(new Date(article.data.article.createdAt), 'MMMM Qo')}
        </time>
      </div>
      <FollowUserButton userUsername={article.data.article.author.username} />{' '}
      {favoriteButton} <UpdateArticleButton articleSlug={props.articleSlug} />{' '}
      <DeleteArticleButton articleSlug={props.articleSlug} />
    </div>
  );
}

ArticleMeta.propTypes = {
  articleSlug: PropTypes.string.isRequired
};

ArticleMeta.fragments = {
  article: gql`
    fragment ArticleMetaArticleFragment on Article {
      author {
        username
        profile {
          imageUrl
        }
        ...FollowUserButtonUserFragment
      }
      canFavorite {
        value
      }
      canUnfavorite {
        value
      }
      createdAt
      favoritesCount
      slug
      viewerDidFavorite
      ...DeleteArticleButtonArticleFragment
      ...UpdateArticleButtonArticleFragment
    }
    ${DeleteArticleButton.fragments.article}
    ${FollowUserButton.fragments.user}
    ${UpdateArticleButton.fragments.article}
  `
};

function actionName(viewerDidFavorite) {
  switch (viewerDidFavorite) {
    case true:
      return 'Unfavorite Article';
    case false:
      return 'Favorite Article';
    default:
      return '';
  }
}

const ArticleMetaQuery = gql`
  query ArticleMetaQuery($slug: ID!) {
    article: articleBySlug(slug: $slug) {
      ...ArticleMetaArticleFragment
    }
  }
  ${ArticleMeta.fragments.article}
`;

const ArticleMetaFavoriteArticleMutation = gql`
  mutation ArticleMetaFavoriteArticleMutation($slug: ID!) {
    favoriteArticle(slug: $slug) {
      article {
        ...ArticleMetaArticleFragment
      }
    }
  }
  ${ArticleMeta.fragments.article}
`;

const ArticleMetaUnfavoriteArticleMutation = gql`
  mutation ArticleMetaUnfavoriteArticleMutation($slug: ID!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...ArticleMetaArticleFragment
      }
    }
  }
  ${ArticleMeta.fragments.article}
`;
