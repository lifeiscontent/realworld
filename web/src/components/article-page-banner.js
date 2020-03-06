import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { format } from '../utils/date';
import gql from 'graphql-tag';
import clsx from 'clsx';

export function ArticlePageBanner(props) {
  const {
    followersCount = 0,
    profile = {},
    canFollow = { value: false },
    canUnfollow = { value: false },
    viewerIsFollowing = false
  } = props.author;

  return (
    <div className="banner">
      <div className="container">
        <h1>{props.title}</h1>
        <div className="article-meta">
          <Link href={`/${props.author.username}`}>
            <a>
              <img
                src={
                  profile.imageUrl
                    ? profile.imageUrl
                    : '/images/smiley-cyrus.jpg'
                }
                alt={`Image of ${props.author.username}`}
              />
            </a>
          </Link>
          <div className="info">
            <a className="author" href={`/${props.author.username}`}>
              {props.author.username}
            </a>
            <time dateTime={props.createdAt} className="date">
              {format(new Date(props.createdAt), 'MMMM Qo')}
            </time>
          </div>{' '}
          {props.canFavorite.value || props.canUnfavorite.value ? (
            <button
              className={clsx('btn btn-sm', {
                'btn-outline-primary': props.viewerDidFavorite === false,
                'btn-primary': props.viewerDidFavorite
              })}
              onClick={() =>
                props.viewerDidFavorite
                  ? props.onUnfavorite({ variables: { slug: props.slug } })
                  : props.onFavorite({ variables: { slug: props.slug } })
              }
            >
              <i className="ion-heart" />{' '}
              {favoriteText(props.viewerDidFavorite)} ({props.favoritesCount})
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
                  ? props.onUnfollow({
                      variables: { username: props.author.username }
                    })
                  : props.onFollow({
                      variables: { username: props.author.username }
                    })
              }
            >
              <i className="ion-plus-round" /> {followText(viewerIsFollowing)}{' '}
              {props.author.username} ({followersCount})
            </button>
          ) : null}{' '}
          {props.canUpdate.value ? (
            <Link href={`/editor/${props.slug}`}>
              <a className="btn btn-outline-secondary btn-sm">
                <i className="ion-edit" /> Edit Article
              </a>
            </Link>
          ) : null}{' '}
          {props.canDelete.value ? (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() =>
                props.onDelete({ variables: { slug: props.slug } })
              }
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
    followersCount: PropTypes.number.isRequired,
    profile: PropTypes.shape({ imageUrl: PropTypes.string }).isRequired,
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
