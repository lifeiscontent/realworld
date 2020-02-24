import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import clsx from 'clsx';

export function ArticlePreviewFavoriteButton(props) {
  const button = useQuery(ArticlePreviewFavoriteButtonQuery, {
    variables: {
      slug: props.slug
    },
    fetchPolicy: 'cache-only'
  });

  const [favoriteArticle] = useMutation(
    ArticlePreviewFavoriteButtonFavoriteMutation,
    {
      variables: {
        slug: props.slug
      }
    }
  );

  const [unfavoriteArticle] = useMutation(
    ArticlePreviewFavoriteButtonUnfavoriteMutation,
    {
      variables: {
        slug: props.slug
      }
    }
  );

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
      className={clsx('btn btn-sm pull-xs-right', {
        'btn-outline-primary': (viewerDidFavorite ?? false) === false,
        'btn-primary': viewerDidFavorite ?? false
      })}
    >
      <i className="ion-heart" /> {button.data?.article?.favoritesCount ?? 0}
    </button>
  ) : null;
}

ArticlePreviewFavoriteButton.propTypes = {
  slug: PropTypes.string.isRequired
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
