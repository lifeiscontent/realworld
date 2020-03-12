import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import clsx from 'clsx';
import { ArticleInfo } from '../article-info';

export function ArticlePreview({
  author,
  canFavorite,
  canUnfavorite,
  createdAt,
  description,
  favoritesCount,
  onFavorite,
  onUnfavorite,
  slug,
  tags,
  title,
  viewerDidFavorite
}) {
  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link href="/[username]" as={`/${author.username}`}>
          <a>
            <img
              src={
                typeof author.profile.imageUrl === 'string'
                  ? author.profile.imageUrl
                  : '/images/smiley-cyrus.jpg'
              }
              alt={`Image of ${author.username}`}
            />
          </a>
        </Link>
        <ArticleInfo createdAt={createdAt} author={author} />
        {
          <div className="pull-xs-right">
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
          </div>
        }
      </div>
      <Link href="/article/[slug]" as={`/article/${slug}`}>
        <a className="preview-link">
          <h1>{title}</h1>
          <p>{description}</p>
          <span>Read more...</span>
          {tags.length > 0 ? (
            <ul className="tag-list">
              {tags.map(tag => (
                <li key={tag.id} className="tag-pill tag-default">
                  {tag.name}
                </li>
              ))}
            </ul>
          ) : null}
        </a>
      </Link>
    </div>
  );
}

ArticlePreview.defaultProps = {
  canFavorite: { value: false },
  canUnfavorite: { value: false },
  favoritesCount: 0,
  viewerDidFavorite: false
};

ArticlePreview.propTypes = {
  author: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profile: PropTypes.shape({
      imageUrl: PropTypes.string
    }).isRequired
  }).isRequired,
  canFavorite: PropTypes.shape({ value: PropTypes.bool.isRequired }),
  canUnfavorite: PropTypes.shape({ value: PropTypes.bool.isRequired }),
  createdAt: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  favoritesCount: PropTypes.number,
  onFavorite: PropTypes.func,
  onUnfavorite: PropTypes.func,
  slug: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  title: PropTypes.string.isRequired,
  viewerDidFavorite: PropTypes.bool
};
