import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { format } from '../../utils/date';
import gql from 'graphql-tag';
import clsx from 'clsx';

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
  const {
    followersCount = 0,
    profile = {},
    canFollow = { value: false },
    canUnfollow = { value: false },
    viewerIsFollowing = false
  } = author;

  return (
    <div className="banner">
      <div className="container">
        <h1>{title}</h1>
        <div className="article-meta">
          <Link href="/[username]" as={`/${author.username}`}>
            <a>
              <img
                src={
                  profile.imageUrl
                    ? profile.imageUrl
                    : '/images/smiley-cyrus.jpg'
                }
                alt={`Image of ${author.username}`}
              />
            </a>
          </Link>
          <div className="info">
            <a className="author" href={`/${author.username}`}>
              {author.username}
            </a>
            <time dateTime={createdAt} className="date">
              {format(new Date(createdAt), 'MMMM Qo')}
            </time>
          </div>{' '}
          {canFavorite.value || canUnfavorite.value ? (
            <button
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
              <i className="ion-heart" /> {favoriteText(viewerDidFavorite)} (
              {favoritesCount})
            </button>
          ) : null}{' '}
          {canFollow.value || canUnfollow.value ? (
            <button
              className={clsx('btn btn-sm action-btn', {
                'btn-outline-secondary': viewerIsFollowing === false,
                'btn-secondary': viewerIsFollowing
              })}
              onClick={() =>
                viewerIsFollowing
                  ? onUnfollow({
                      variables: { username: author.username }
                    })
                  : onFollow({
                      variables: { username: author.username }
                    })
              }
            >
              <i className="ion-plus-round" /> {followText(viewerIsFollowing)}{' '}
              {author.username} ({followersCount})
            </button>
          ) : null}{' '}
          {canUpdate.value ? (
            <Link href="/editor/[slug]" as={`/editor/${slug}`}>
              <a className="btn btn-outline-secondary btn-sm">
                <i className="ion-edit" /> Edit Article
              </a>
            </Link>
          ) : null}{' '}
          {canDelete.value ? (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete({ variables: { slug: slug } })}
            >
              <i className="ion-trash-a" /> Delete Article
            </button>
          ) : null}{' '}
        </div>
      </div>
    </div>
  );
}

ArticlePageBanner.fragments = {
  author: gql`
    fragment ArticlePageBannerUserFragment on User {
      canFollow {
        value
      }
      canUnfollow {
        value
      }
      followersCount
      profile {
        imageUrl
      }
      username
      viewerIsFollowing
    }
  `,
  article: gql`
    fragment ArticlePageBannerArticleFragment on Article {
      canDelete {
        value
      }
      canFavorite {
        value
      }
      canUnfavorite {
        value
      }
      canUpdate {
        value
      }
      createdAt
      favoritesCount
      slug
      title
      viewerDidFavorite
    }
  `
};

ArticlePageBanner.defaultProps = {
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

function followText(viewerIsFollowing) {
  switch (viewerIsFollowing) {
    case true:
      return 'Unfollow';
    default:
      return 'Follow';
  }
}

function favoriteText(viewerDidFavorite) {
  switch (viewerDidFavorite) {
    case true:
      return 'Unfavorite Article';
    default:
      return 'Favorite Article';
  }
}
