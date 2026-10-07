import { gql, type TypedDocumentNode } from '@apollo/client';
import { href, Link } from 'react-router';

import type { ArticlePreview_ArticleFragment } from '../../types/__generated__/graphql';
import { TagList } from '../../ui/TagList';
import { ARTICLE_META_FRAGMENT, ArticleMeta } from './ArticleMeta';
import { FavoriteButton } from './FavoriteButton';

export const ARTICLE_PREVIEW_FRAGMENT: TypedDocumentNode<ArticlePreview_ArticleFragment> = gql`
  fragment ArticlePreview_article on Article {
    slug
    title
    description
    tagList
    favorited
    favoritesCount
    ...ArticleMeta_article
  }
  ${ARTICLE_META_FRAGMENT}
`;

interface ArticlePreviewProps {
  article: ArticlePreview_ArticleFragment;
}

/** An article in a list: the author, the summary, and the tags. */
export function ArticlePreview({ article }: ArticlePreviewProps) {
  return (
    <div className="article-preview">
      <ArticleMeta article={article}>
        <FavoriteButton
          variant="preview"
          slug={article.slug}
          favorited={article.favorited}
          favoritesCount={article.favoritesCount}
        />
      </ArticleMeta>
      <Link
        to={href('/article/:slug', { slug: article.slug })}
        className="preview-link"
      >
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <TagList tags={article.tagList} />
      </Link>
    </div>
  );
}
