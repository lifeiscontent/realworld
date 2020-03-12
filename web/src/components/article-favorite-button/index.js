import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

export function ArticleFavoriteButton({
  disabled,
  favoritesCount,
  onFavorite,
  onUnfavorite,
  slug,
  viewerDidFavorite
}) {
  const handleClick = useCallback(
    event => {
      event.preventDefault();
      if (viewerDidFavorite) {
        onUnfavorite({ variables: { slug } });
      } else {
        onFavorite({ variables: { slug } });
      }
    },
    [onFavorite, onUnfavorite, slug, viewerDidFavorite]
  );
  return (
    <button
      className={clsx('btn btn-sm', {
        'btn-outline-primary': viewerDidFavorite === false,
        'btn-primary': viewerDidFavorite
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

ArticleFavoriteButton.defaultProps = {
  disabled: false,
  favoritesCount: 0,
  viewerDidFavorite: false
};

ArticleFavoriteButton.propTypes = {
  disabled: PropTypes.bool,
  favoritesCount: PropTypes.number,
  onFavorite: PropTypes.func,
  onUnfavorite: PropTypes.func,
  slug: PropTypes.string.isRequired,
  viewerDidFavorite: PropTypes.bool
};
