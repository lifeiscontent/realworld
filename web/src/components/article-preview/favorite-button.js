import PropTypes from 'prop-types';
import clsx from 'clsx';
import { gql } from '@apollo/client';

export function ArticlePreviewFavoriteButton({
  canFavorite,
  canUnfavorite,
  favoritesCount = 0,
  onFavorite,
  onUnfavorite,
  slug,
  viewerDidFavorite,
}) {
  return (
    <button
      disabled={!canFavorite?.value && !canUnfavorite?.value}
      className={clsx('btn btn-sm', {
        'btn-outline-primary': !viewerDidFavorite,
        'btn-primary': !!viewerDidFavorite,
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
  `,
};

ArticlePreviewFavoriteButton.propTypes = {
  canFavorite: PropTypes.shape({ value: PropTypes.bool }),
  canUnfavorite: PropTypes.shape({ value: PropTypes.bool }),
  favoritesCount: PropTypes.number,
  onFavorite: PropTypes.func.isRequired,
  onUnfavorite: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
  viewerDidFavorite: PropTypes.bool,
};
