import { gql, type TypedDocumentNode } from '@apollo/client';
import type { ReactNode } from 'react';
import { href, Link } from 'react-router';

import { formatDate } from '../../lib/date';
import type { ArticleMeta_ArticleFragment } from '../../types/__generated__/graphql';
import { Avatar } from '../../ui/Avatar';

export const ARTICLE_META_FRAGMENT: TypedDocumentNode<ArticleMeta_ArticleFragment> = gql`
  fragment ArticleMeta_article on Article {
    createdAt
    author {
      username
      image
    }
  }
`;

interface ArticleMetaProps {
  article: ArticleMeta_ArticleFragment;
  /** The actions after the author, for example the favorite button. */
  children?: ReactNode;
}

/** The author and the date of an article, with its actions. */
export function ArticleMeta({ article, children }: ArticleMetaProps) {
  const { author } = article;

  return (
    <div className="article-meta">
      <Link
        to={href('/profile/:username/:tab?', { username: author.username })}
      >
        <Avatar name={author.username} image={author.image} />
      </Link>
      <div className="info">
        <Link
          to={href('/profile/:username/:tab?', { username: author.username })}
          className="author"
        >
          {author.username}
        </Link>
        <span className="date">{formatDate(article.createdAt)}</span>
      </div>
      {children}
    </div>
  );
}
