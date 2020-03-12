import React from 'react';
import PropTypes from 'prop-types';
import { ArticleMeta } from '../article-meta';

export function ArticlePageBanner({
  author,
  canDelete,
  canFavorite,
  canUnfavorite,
  canUpdate,
  createdAt,
  favoritesCount,
  onDelete,
  onFavorite,
  onFollow,
  onUnfavorite,
  onUnfollow,
  slug,
  title,
  viewerDidFavorite
}) {
  return (
    <div className="banner">
      <div className="container">
        <h1>{title}</h1>
        <ArticleMeta
          author={author}
          canDelete={canDelete}
          canFavorite={canFavorite}
          canUnfavorite={canUnfavorite}
          canUpdate={canUpdate}
          createdAt={createdAt}
          favoritesCount={favoritesCount}
          onDelete={onDelete}
          onFavorite={onFavorite}
          onFollow={onFollow}
          onUnfavorite={onUnfavorite}
          onUnfollow={onUnfollow}
          slug={slug}
          viewerDidFavorite={viewerDidFavorite}
        />
      </div>
    </div>
  );
}

ArticlePageBanner.defaultProps = {
  author: {},
  favoritesCount: 0,
  canFavorite: { value: false },
  canUnfavorite: { value: false },
  canUpdate: { value: false },
  canDelete: { value: false },
  viewerDidFavorite: false
};

ArticlePageBanner.propTypes = {
  author: PropTypes.shape({
    canFollow: PropTypes.shape({ value: PropTypes.bool }),
    canUnfollow: PropTypes.shape({ value: PropTypes.bool }),
    followersCount: PropTypes.number,
    profile: PropTypes.shape({ imageUrl: PropTypes.string }),
    username: PropTypes.string.isRequired,
    viewerIsFollowing: PropTypes.bool
  }).isRequired,
  canDelete: PropTypes.shape({ value: PropTypes.bool }),
  canFavorite: PropTypes.shape({ value: PropTypes.bool }),
  canUnfavorite: PropTypes.shape({ value: PropTypes.bool }),
  canUpdate: PropTypes.shape({ value: PropTypes.bool }),
  createdAt: PropTypes.string.isRequired,
  favoritesCount: PropTypes.number,
  onDelete: PropTypes.func.isRequired,
  onFavorite: PropTypes.func.isRequired,
  onFollow: PropTypes.func.isRequired,
  onUnfavorite: PropTypes.func.isRequired,
  onUnfollow: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  viewerDidFavorite: PropTypes.bool
};
