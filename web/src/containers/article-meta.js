import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { format } from '../utils/date';
import gql from 'graphql-tag';
import { UpdateArticleButton } from './update-article-button';
import { FollowUserButton } from './follow-user-button';
import { FavoriteArticleButton } from './favorite-article-button';
import { DeleteArticleButton } from './delete-article-button';

export function ArticleMeta(props) {
  const article = useQuery(ArticleMetaQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      slug: props.articleSlug
    }
  });

  if (article.loading) return null;

  return (
    <div className="article-meta">
      <Link href="/[username]" as={`/${article.data.article.author.username}`}>
        <a>
          <img
            src={
              article.data.article.author.profile.imageUrl ??
              '/images/smiley-cyrus.jpg'
            }
            alt={`Image of ${article.data.article.author.username}`}
          />
        </a>
      </Link>
      <div className="info">
        <Link
          href="/[username]"
          as={`/${article.data.article.author.username}`}
        >
          <a className="author">{article.data.article.author.username}</a>
        </Link>
        <time dateTime={article.data.article.createdAt} className="date">
          {article.data.article.createdAt
            ? format(new Date(article.data.article.createdAt), 'MMMM Qo')
            : null}
        </time>
      </div>
      <FollowUserButton userUsername={article.data.article.author.username} />{' '}
      <FavoriteArticleButton articleSlug={props.articleSlug} />{' '}
      <UpdateArticleButton articleSlug={props.articleSlug} />{' '}
      <DeleteArticleButton articleSlug={props.articleSlug} />
    </div>
  );
}

ArticleMeta.propTypes = {
  articleSlug: PropTypes.string.isRequired
};

ArticleMeta.fragments = {
  article: gql`
    fragment ArticleMetaArticleFragment on Article {
      slug
      createdAt
      author {
        username
        ...FollowUserButtonUserFragment
        profile {
          imageUrl
        }
      }
      ...DeleteArticleButtonArticleFragment
      ...FavoriteArticleButtonArticleFragment
      ...UpdateArticleButtonArticleFragment
    }
    ${DeleteArticleButton.fragments.article}
    ${FavoriteArticleButton.fragments.article}
    ${FollowUserButton.fragments.user}
    ${UpdateArticleButton.fragments.article}
  `
};

const ArticleMetaQuery = gql`
  query ArticleMetaQuery($slug: ID!) {
    article: articleBySlug(slug: $slug) {
      ...ArticleMetaArticleFragment
    }
  }
  ${ArticleMeta.fragments.article}
`;
