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

export function FavoriteButton(props) {
  const button = useQuery(FavoriteButtonQuery, {
    variables: {
      slug: props.slug
    },
    fetchPolicy: 'cache-only'
  });

  const [favoriteArticle] = useMutation(FavoriteButtonFavoriteMutation, {
    variables: {
      slug: props.slug
    }
  });

  const [unfavoriteArticle] = useMutation(FavoriteButtonUnfavoriteMutation, {
    variables: {
      slug: props.slug
    }
  });

  const handleClick = useCallback(
    event => {
      event.preventDefault();
      if (typeof button.data?.article?.viewerDidFavorite !== 'boolean') return;

      if (button.data?.article?.viewerDidFavorite) {
        unfavoriteArticle();
      } else {
        favoriteArticle();
      }
    },
    [button.data, favoriteArticle, unfavoriteArticle]
  );

  const isActionable =
    (button.data?.article?.canFavorite?.value ||
      button.data?.article?.canUnfavorite?.value) ??
    false;

  const viewerDidFavorite = button.data?.article?.viewerDidFavorite;

  return isActionable ? (
    <button
      onClick={handleClick}
      className={clsx('btn btn-sm action-btn', {
        'btn-outline-primary': (viewerDidFavorite ?? false) === false,
        'btn-primary': viewerDidFavorite ?? false
      })}
    >
      <i className="ion-heart" /> {actionName(viewerDidFavorite)} (
      {button.data?.article?.favoritesCount ?? 0})
    </button>
  ) : null;
}

FavoriteButton.propTypes = {
  slug: PropTypes.string.isRequired
};

FavoriteButton.fragments = {
  article: gql`
    fragment FavoriteButtonArticleFragment on Article {
      id
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

const FavoriteButtonQuery = gql`
  query FavoriteButtonQuery($slug: String!) {
    article: articleBySlug(slug: $slug) {
      ...FavoriteButtonArticleFragment
    }
  }
  ${FavoriteButton.fragments.article}
`;

const FavoriteButtonFavoriteMutation = gql`
  mutation FavoriteButtonFavoriteMutation($slug: String!) {
    favoriteArticle(slug: $slug) {
      article {
        ...FavoriteButtonArticleFragment
      }
    }
  }
  ${FavoriteButton.fragments.article}
`;

const FavoriteButtonUnfavoriteMutation = gql`
  mutation FavoriteButtonUnfavoriteMutation($slug: String!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...FavoriteButtonArticleFragment
      }
    }
  }
  ${FavoriteButton.fragments.article}
`;
