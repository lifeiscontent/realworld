import { Form, Link } from 'react-router';
import type { ArticleMeta_ArticleFragment } from '../types/__generated__/graphql';
import { formatDate } from '../lib/date';
import { FavoriteButton } from './FavoriteButton';
import { FollowButton } from './FollowButton';
import { UserAvatar } from './UserAvatar';
import { paths } from '../lib/paths';
import { gql, type TypedDocumentNode } from '@apollo/client';

export const ARTICLE_META_FRAGMENT: TypedDocumentNode<ArticleMeta_ArticleFragment> = gql`
  fragment ArticleMeta_article on Article {
    slug
    createdAt
    favorited
    favoritesCount
    author {
      username
      image
      following
    }
  }
`;

interface ArticleMetaProps {
  article: ArticleMeta_ArticleFragment;
  /** The author can edit and delete the article. */
  isAuthor: boolean;
}

/**
 * The author, the date, and the actions of an article. The author can edit
 * and delete the article. Other users can follow the author and favorite the
 * article.
 */
export function ArticleMeta({ article, isAuthor }: ArticleMetaProps) {
  const { author } = article;

  return (
    <div className="article-meta">
      <Link to={paths.profile(author.username)}>
        <UserAvatar username={author.username} image={author.image} />
      </Link>
      <div className="info">
        <Link to={paths.profile(author.username)} className="author">
          {author.username}
        </Link>
        <span className="date">{formatDate(article.createdAt)}</span>
      </div>
      {isAuthor ? (
        <>
          <Link
            className="btn btn-sm btn-outline-secondary"
            to={paths.editor(article.slug)}
          >
            <i className="ion-edit" /> Edit Article
          </Link>{' '}
          <Form
            method="delete"
            action={paths.article(article.slug)}
            style={{ display: 'inline' }}
          >
            <button type="submit" className="btn btn-sm btn-outline-danger">
              <i className="ion-trash-a" /> Delete Article
            </button>
          </Form>
        </>
      ) : (
        <>
          <FollowButton
            username={author.username}
            following={author.following}
          />
          &nbsp;&nbsp;
          <FavoriteButton
            variant="article"
            slug={article.slug}
            favorited={article.favorited}
            favoritesCount={article.favoritesCount}
          />
        </>
      )}
    </div>
  );
}
