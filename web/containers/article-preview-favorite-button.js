import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import clsx from 'clsx';

export function ArticlePreviewFavoriteButton(props) {
  const button = useQuery(ArticlePreviewFavoriteButtonQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      slug: props.articleSlug
    }
  });

  const [favoriteArticle] = useMutation(
    ArticlePreviewFavoriteButtonFavoriteMutation,
    {
      variables: {
        slug: props.articleSlug
      }
    }
  );

  const [unfavoriteArticle] = useMutation(
    ArticlePreviewFavoriteButtonUnfavoriteMutation,
    {
      variables: {
        slug: props.articleSlug
      },
      update: props.onUnfavoriteArticle
    }
  );

  const handleClick = useCallback(
    event => {
      event.preventDefault();
      if (button.data.article.viewerDidFavorite) {
        unfavoriteArticle();
      } else {
        favoriteArticle();
      }
    },
    [button.data, favoriteArticle, unfavoriteArticle]
  );

  if (button.loading) return null;

  const isActionable =
    (button.data.article.canFavorite.value ||
      button.data.article.canUnfavorite.value) ??
    false;

  const viewerDidFavorite = button.data.article.viewerDidFavorite;

  return isActionable ? (
    <button
      onClick={handleClick}
      className={clsx('btn btn-sm pull-xs-right', {
        'btn-outline-primary': (viewerDidFavorite ?? false) === false,
        'btn-primary': viewerDidFavorite ?? false
      })}
    >
      <i className="ion-heart" /> {button.data.article.favoritesCount ?? 0}
    </button>
  ) : null;
}

ArticlePreviewFavoriteButton.propTypes = {
  articleSlug: PropTypes.string.isRequired,
  onUnfavoriteArticle: PropTypes.func
};

ArticlePreviewFavoriteButton.fragments = {
  article: gql`
    fragment ArticlePreviewFavoriteButtonArticleFragment on Article {
      favoritesCount
      slug
      viewerDidFavorite
      canFavorite {
        value
      }
      canUnfavorite {
        value
      }
    }
  `
};

const ArticlePreviewFavoriteButtonQuery = gql`
  query ArticlePreviewFavoriteButtonQuery($slug: String!) {
    article: articleBySlug(slug: $slug) {
      ...ArticlePreviewFavoriteButtonArticleFragment
    }
  }
  ${ArticlePreviewFavoriteButton.fragments.article}
`;

const ArticlePreviewFavoriteButtonFavoriteMutation = gql`
  mutation ArticlePreviewFavoriteButtonFavoriteMutation($slug: String!) {
    favoriteArticle(slug: $slug) {
      article {
        ...ArticlePreviewFavoriteButtonArticleFragment
      }
    }
  }
  ${ArticlePreviewFavoriteButton.fragments.article}
`;

const ArticlePreviewFavoriteButtonUnfavoriteMutation = gql`
  mutation ArticlePreviewFavoriteButtonUnfavoriteMutation($slug: String!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...ArticlePreviewFavoriteButtonArticleFragment
      }
    }
  }
  ${ArticlePreviewFavoriteButton.fragments.article}
`;
