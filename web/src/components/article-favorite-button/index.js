import PropTypes from 'prop-types';
import clsx from 'clsx';
import { gql } from '@apollo/client';

export function ArticleFavoriteButton({
  canFavorite,
  canUnfavorite,
  favoritesCount = 0,
  onFavorite,
  onUnfavorite,
  slug,
  viewerDidFavorite,
}) {
  const handleClick = event => {
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
        'btn-outline-primary': !viewerDidFavorite,
        'btn-primary': !!viewerDidFavorite,
      })}
      disabled={!canUnfavorite?.value && !canFavorite?.value}
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

ArticleFavoriteButton.propTypes = {
  canFavorite: PropTypes.shape({ value: PropTypes.bool }),
  canUnfavorite: PropTypes.shape({ value: PropTypes.bool }),
  favoritesCount: PropTypes.number,
  onFavorite: PropTypes.func.isRequired,
  onUnfavorite: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
  viewerDidFavorite: PropTypes.bool,
};
