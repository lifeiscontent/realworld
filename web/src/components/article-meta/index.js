import PropTypes from 'prop-types';
import { ArticleUpdateButton } from '../article-update-button';
import { ArticleDeleteButton } from '../article-delete-button';
import { ArticleFavoriteButton } from '../article-favorite-button';
import { UserFollowButton } from '../user-follow-button';
import { UserAvatarLink } from '../user-avatar-link';
import { ArticleInfo } from '../article-info';
import { gql } from '@apollo/client';

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
  viewerDidFavorite,
}) {
  const followUserButton = (
    <UserFollowButton onFollow={onFollow} onUnfollow={onUnfollow} {...author} />
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
      <UserAvatarLink size="32" {...author} />
      <ArticleInfo author={author} createdAt={createdAt} />
      {followUserButton} {favoriteArticleButton} {articleUpdateButton}{' '}
      {articleDeleteButton}
    </div>
  );
}

ArticleMeta.fragments = {
  author: gql`
    fragment ArticleMetaAuthorFragment on User {
      ...UserAvatarLinkUserFragment
      ...UserFollowButtonUserFragment
    }
    ${UserAvatarLink.fragments.user}
    ${UserFollowButton.fragments.user}
  `,
  article: gql`
    fragment ArticleMetaArticleFragment on Article {
      favoritesCount
      slug
      viewerDidFavorite
      ...ArticleDeleteButtonArticleFragment
      ...ArticleFavoriteButtonArticleFragment
      ...ArticleInfoArticleFragment
      ...ArticleUpdateButtonArticleFragment
    }
    ${ArticleDeleteButton.fragments.article}
    ${ArticleFavoriteButton.fragments.article}
    ${ArticleInfo.fragments.article}
    ${ArticleUpdateButton.fragments.article}
  `,
};

ArticleMeta.propTypes = {
  author: PropTypes.object.isRequired,
  canDelete: PropTypes.object,
  canFavorite: PropTypes.object,
  canUnfavorite: PropTypes.object,
  canUpdate: PropTypes.object,
  createdAt: PropTypes.string.isRequired,
  favoritesCount: PropTypes.number,
  onDelete: PropTypes.func.isRequired,
  onFavorite: PropTypes.func.isRequired,
  onFollow: PropTypes.func.isRequired,
  onUnfavorite: PropTypes.func.isRequired,
  onUnfollow: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
  viewerDidFavorite: PropTypes.bool,
};
