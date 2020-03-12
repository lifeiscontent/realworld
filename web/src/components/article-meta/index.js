import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { ArticleUpdateButton } from '../article-update-button';
import { ArticleDeleteButton } from '../article-delete-button';
import { ArticleFavoriteButton } from '../article-favorite-button';
import { UserFollowButton } from '../user-follow-button';
import { ArticleInfo } from '../article-info';

export function ArticleMeta({
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
  viewerDidFavorite
}) {
  const {
    canFollow = { value: false },
    canUnfollow = { value: false },
    followersCount = 0,
    profile = {},
    username,
    viewerIsFollowing = false
  } = author;

  const followUserButton = (
    <UserFollowButton
      canFollow={canFollow}
      canUnfollow={canUnfollow}
      followersCount={followersCount}
      onFollow={onFollow}
      onUnfollow={onUnfollow}
      username={username}
      viewerIsFollowing={viewerIsFollowing}
    />
  );

  const favoriteArticleButton = (
    <ArticleFavoriteButton
      canFavorite={canFavorite}
      canUnfavorite={canUnfavorite}
      favoritesCount={favoritesCount}
      onFavorite={onFavorite}
      onUnfavorite={onUnfavorite}
      slug={slug}
      viewerDidFavorite={viewerDidFavorite}
    />
  );

  const articleUpdateButton = (
    <ArticleUpdateButton canUpdate={canUpdate} slug={slug} />
  );

  const articleDeleteButton = (
    <ArticleDeleteButton
      canDelete={canDelete}
      onDelete={onDelete}
      slug={slug}
    />
  );

  return (
    <div className="article-meta">
      <Link href="/[username]" as={`/${username}`}>
        <a>
          <img
            src={profile.imageUrl ?? '/images/smiley-cyrus.jpg'}
            alt={`Image of ${username}`}
          />
        </a>
      </Link>
      <ArticleInfo author={author} createdAt={createdAt} />
      {followUserButton} {favoriteArticleButton} {articleUpdateButton}{' '}
      {articleDeleteButton}
    </div>
  );
}

ArticleMeta.defaultProps = {
  author: {},
  favoritesCount: 0,
  canFavorite: { value: false },
  canUnfavorite: { value: false },
  canUpdate: { value: false },
  canDelete: { value: false },
  viewerDidFavorite: false
};

ArticleMeta.propTypes = {
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
  viewerDidFavorite: PropTypes.bool
};
