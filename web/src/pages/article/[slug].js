import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import Markdown from 'react-markdown';
import { CommentsList } from '../../containers/comments-list';
import { Banner } from '../../containers/banner';
import { ArticleMeta } from '../../containers/article-meta';
import withApollo from '../../lib/with-apollo';
import { Layout } from '../../components/layout';

const ArticlePageQuery = gql`
  query ArticlePageQuery($slug: String!) {
    viewer {
      ...CommentsListUserFragment
      ...LayoutUserFragment
    }
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
  ${CommentsList.fragments.user}
  ${Layout.fragments.user}
`;

function ArticlePage() {
  const router = useRouter();
  const article = useQuery(ArticlePageQuery, {
    variables: {
      slug: router.query.slug
    }
  });

  if (article.loading) return null;

  return (
    <Layout userId={article.data.viewer?.id}>
      <div className="article-page">
        <Banner articleSlug={router.query.slug} />
        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <Markdown source={article.data.article.body} />
            </div>
          </div>
          <hr />
          <div className="article-actions">
            <ArticleMeta articleSlug={router.query.slug} />
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              <CommentsList
                userId={article.data.viewer?.id}
                articleSlug={router.query.slug}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withApollo(ArticlePage);
