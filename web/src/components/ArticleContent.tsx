import Markdown from 'react-markdown';
import type { ArticleContent_ArticleFragment } from '../types/__generated__/graphql';
import { TagList } from './TagList';
import { gql, type TypedDocumentNode } from '@apollo/client';

export const ARTICLE_CONTENT_FRAGMENT: TypedDocumentNode<ArticleContent_ArticleFragment> = gql`
  fragment ArticleContent_article on Article {
    body
    tagList
  }
`;

interface ArticleContentProps {
  article: ArticleContent_ArticleFragment;
}

/** The article body. react-markdown does not render raw HTML, so it is safe. */
export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <div className="row article-content">
      <div className="col-md-12">
        <Markdown>{article.body}</Markdown>
        <TagList tags={article.tagList} />
      </div>
    </div>
  );
}
