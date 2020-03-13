import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import gql from 'graphql-tag';

export function ArticlePreviewFavoriteButton({
  canFavorite,
  canUnfavorite,
  favoritesCount,
  onFavorite,
  onUnfavorite,
  slug,
  viewerDidFavorite
}) {
  return (
    <button
      disabled={!(canFavorite.value || canUnfavorite.value)}
      className={clsx('btn btn-sm', {
        'btn-outline-primary': viewerDidFavorite === false,
        'btn-primary': viewerDidFavorite
      })}
      onClick={() =>
        viewerDidFavorite
          ? onUnfavorite({ variables: { slug: slug } })
          : onFavorite({ variables: { slug: slug } })
      }
    >
      <i className="ion-heart" /> {favoritesCount}
    </button>
  );
}

ArticlePreviewFavoriteButton.fragments = {
  article: gql`
    fragment ArticlePreviewFavoriteButtonArticleFragment on Article {
      canFavorite {
        value
      }
      canUnfavorite {
        value
      }
      favoritesCount
      slug
      viewerDidFavorite
    }
  `
};

ArticlePreviewFavoriteButton.defaultProps = {
  canFavorite: { value: false },
  canUnfavorite: { value: false },
  favoritesCount: 0,
  viewerDidFavorite: false
};

ArticlePreviewFavoriteButton.propTypes = {
  canFavorite: PropTypes.shape({ value: PropTypes.bool }),
  canUnfavorite: PropTypes.shape({ value: PropTypes.bool }),
  favoritesCount: PropTypes.number,
  onFavorite: PropTypes.func.isRequired,
  onUnfavorite: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
  viewerDidFavorite: PropTypes.bool
};
