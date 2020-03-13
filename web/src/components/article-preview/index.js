import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { ArticleInfo } from '../article-info';
import { ArticlePreviewFavoriteButton } from './favorite-button';
import { ArticlePreviewTagsList } from './tags-list';
import gql from 'graphql-tag';
import { UserAvatarLink } from '../user-avatar-link';

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
        <UserAvatarLink {...author} />
        <ArticleInfo createdAt={createdAt} author={author} />
        <div className="pull-xs-right">
          <ArticlePreviewFavoriteButton
            canFavorite={canFavorite}
            canUnfavorite={canUnfavorite}
            favoritesCount={favoritesCount}
            onFavorite={onFavorite}
            onUnfavorite={onUnfavorite}
            slug={slug}
            viewerDidFavorite={viewerDidFavorite}
          />
        </div>
      </div>
      <Link href="/article/[slug]" as={`/article/${slug}`}>
        <a className="preview-link">
          <h1>{title}</h1>
          <p>{description}</p>
          <span>Read more...</span>
          <ArticlePreviewTagsList tags={tags} />
        </a>
      </Link>
    </div>
  );
}

ArticlePreview.fragments = {
  author: gql`
    fragment ArticlePreviewAuthorFragment on User {
      ...UserAvatarLinkUserFragment
    }
    ${UserAvatarLink.fragments.user}
  `,
  article: gql`
    fragment ArticlePreviewArticleFragment on Article {
      title
      description
      ...ArticleInfoArticleFragment
      ...ArticlePreviewFavoriteButtonArticleFragment
      ...ArticlePreviewTagsListArticleFragment
    }
    ${ArticleInfo.fragments.article}
    ${ArticlePreviewFavoriteButton.fragments.article}
    ${ArticlePreviewTagsList.fragments.article}
  `
};

ArticlePreview.defaultProps = {
  favoritesCount: 0,
  viewerDidFavorite: false
};

ArticlePreview.propTypes = {
  author: PropTypes.object,
  canFavorite: PropTypes.object,
  canUnfavorite: PropTypes.object,
  createdAt: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  favoritesCount: PropTypes.number,
  onFavorite: PropTypes.func,
  onUnfavorite: PropTypes.func,
  slug: PropTypes.string.isRequired,
  tags: PropTypes.array,
  title: PropTypes.string.isRequired,
  viewerDidFavorite: PropTypes.bool
};
