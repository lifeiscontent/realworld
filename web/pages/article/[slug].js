import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import Markdown from 'react-markdown';
import { CommentsList, Banner, ArticleMeta } from '../../containers';

const ArticlePageQuery = gql`
  query ArticlePageQuery($slug: String!) {
    article: articleBySlug(slug: $slug) {
      slug
      body
      ...ArticleMetaArticleFragment
      ...BannerArticleFragment
      ...CommentsListArticleFragment
    }
  }
  ${ArticleMeta.fragments.article}
  ${Banner.fragments.article}
  ${CommentsList.fragments.article}
`;

export default function ArticlePage() {
  const router = useRouter();
  const article = useQuery(ArticlePageQuery, {
    variables: {
      slug: router.query.slug
    },
    skip: typeof router.query.slug !== 'string'
  });

  return (
    <div className="article-page">
      <Banner slug={article.data?.article?.slug} />
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <Markdown source={article.data?.article?.body ?? '# Loading...'} />
          </div>
        </div>
        <hr />
        <div className="article-actions">
          <ArticleMeta slug={article.data?.article?.slug} />
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <CommentsList slug={article.data?.article?.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
