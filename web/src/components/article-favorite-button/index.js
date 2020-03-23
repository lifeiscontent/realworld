import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import gql from 'graphql-tag';

export function ArticleFavoriteButton({
  canFavorite,
  canUnfavorite,
  favoritesCount,
  onFavorite,
  onUnfavorite,
  slug,
  viewerDidFavorite,
}) {
  const disabled = !(canUnfavorite.value || canFavorite.value);
  const handleClick = (event) => {
    event.preventDefault();
    if (viewerDidFavorite) {
      onUnfavorite({ variables: { slug } });
    } else {
      onFavorite({ variables: { slug } });
    }
  };

  return (
    <button
      className={clsx('btn btn-sm', {
        'btn-outline-primary': viewerDidFavorite === false,
        'btn-primary': viewerDidFavorite,
      })}
      disabled={disabled}
      onClick={handleClick}
    >
      <i className="ion-heart" />{' '}
      {viewerDidFavorite ? 'Unfavorite Article' : 'Favorite Article'} (
      {favoritesCount})
    </button>
  );
}

ArticleFavoriteButton.fragments = {
  article: gql`
    fragment ArticleFavoriteButtonArticleFragment on Article {
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
  `,
};

ArticleFavoriteButton.defaultProps = {
  canFavorite: { value: false },
  canUnfavorite: { value: false },
  favoritesCount: 0,
  viewerDidFavorite: false,
};

ArticleFavoriteButton.propTypes = {
  canFavorite: PropTypes.shape({ value: PropTypes.bool }),
  canUnfavorite: PropTypes.shape({ value: PropTypes.bool }),
  favoritesCount: PropTypes.number,
  onFavorite: PropTypes.func.isRequired,
  onUnfavorite: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
  viewerDidFavorite: PropTypes.bool,
};
