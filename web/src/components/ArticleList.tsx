import type { ReactNode } from 'react';
import type { ArticlePreview_ArticleFragment } from '../types/__generated__/graphql';
import { ArticlePreview } from './ArticlePreview';

interface ArticleListProps {
  articles: ReadonlyArray<ArticlePreview_ArticleFragment>;
  /** Shows when there are no articles. */
  emptyMessage?: ReactNode;
}

export function ArticleList({
  articles,
  emptyMessage = 'No articles are here... yet.',
}: ArticleListProps) {
  if (!articles.length) {
    return (
      <div className="article-preview empty-feed-message">{emptyMessage}</div>
    );
  }

  return articles.map(article => (
    <ArticlePreview key={article.slug} article={article} />
  ));
}
