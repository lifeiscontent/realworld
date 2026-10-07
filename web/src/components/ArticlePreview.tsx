import { Link } from 'react-router';
import type { ArticlePreview_ArticleFragment } from '../types/__generated__/graphql';
import { formatDate } from '../lib/date';
import { FavoriteButton } from './FavoriteButton';
import { TagList } from './TagList';
import { UserAvatar } from './UserAvatar';
import { paths } from '../lib/paths';
import { gql, type TypedDocumentNode } from '@apollo/client';

export const ARTICLE_PREVIEW_FRAGMENT: TypedDocumentNode<ArticlePreview_ArticleFragment> = gql`
  fragment ArticlePreview_article on Article {
    slug
    title
    description
    tagList
    createdAt
    favorited
    favoritesCount
    author {
      username
      image
    }
  }
`;

interface ArticlePreviewProps {
  article: ArticlePreview_ArticleFragment;
}

export function ArticlePreview({ article }: ArticlePreviewProps) {
  const { author } = article;

  return (
    <div className="article-preview">
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
        <FavoriteButton
          variant="preview"
          slug={article.slug}
          favorited={article.favorited}
          favoritesCount={article.favoritesCount}
        />
      </div>
      <Link to={paths.article(article.slug)} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <TagList tags={article.tagList} />
      </Link>
    </div>
  );
}
