import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import clsx from 'clsx';

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

export function FavoriteArticleButton(props) {
  const button = useQuery(FavoriteArticleButtonQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      slug: props.articleSlug
    }
  });

  const [favoriteArticle] = useMutation(FavoriteArticleButtonFavoriteMutation, {
    variables: {
      slug: props.articleSlug
    }
  });

  const [unfavoriteArticle] = useMutation(
    FavoriteArticleButtonUnfavoriteMutation,
    {
      variables: {
        slug: props.articleSlug
      }
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
      className={clsx('btn btn-sm action-btn', {
        'btn-outline-primary': (viewerDidFavorite ?? false) === false,
        'btn-primary': viewerDidFavorite ?? false
      })}
    >
      <i className="ion-heart" /> {actionName(viewerDidFavorite)} (
      {button.data.article.favoritesCount ?? 0})
    </button>
  ) : null;
}

FavoriteArticleButton.propTypes = {
  articleSlug: PropTypes.string.isRequired
};

FavoriteArticleButton.fragments = {
  article: gql`
    fragment FavoriteArticleButtonArticleFragment on Article {
      slug
      favoritesCount
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

const FavoriteArticleButtonQuery = gql`
  query FavoriteArticleButtonQuery($slug: String!) {
    article: articleBySlug(slug: $slug) {
      ...FavoriteArticleButtonArticleFragment
    }
  }
  ${FavoriteArticleButton.fragments.article}
`;

const FavoriteArticleButtonFavoriteMutation = gql`
  mutation FavoriteArticleButtonFavoriteMutation($slug: String!) {
    favoriteArticle(slug: $slug) {
      article {
        ...FavoriteArticleButtonArticleFragment
      }
    }
  }
  ${FavoriteArticleButton.fragments.article}
`;

const FavoriteArticleButtonUnfavoriteMutation = gql`
  mutation FavoriteArticleButtonUnfavoriteMutation($slug: String!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...FavoriteArticleButtonArticleFragment
      }
    }
  }
  ${FavoriteArticleButton.fragments.article}
`;
