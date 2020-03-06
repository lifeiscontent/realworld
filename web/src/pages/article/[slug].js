import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { ArticleContent } from '../../components/article-content';
import { ArticlePageBanner } from '../../components/article-page-banner';
import { ArticleMeta } from '../../containers/article-meta';
import withApollo from '../../lib/with-apollo';
import { Layout } from '../../components/layout';
import { ArticleCommentList } from '../../containers/article-comment-list';

function ArticlePage() {
  const router = useRouter();
  const article = useQuery(ArticlePageQuery, {
    variables: {
      slug: router.query.slug
    }
  });

  const [deleteArticle] = useMutation(ArticlePageDeleteArticleMutation);
  const [favoriteArticle] = useMutation(ArticlePageFavoriteArticleMutation);
  const [followUser] = useMutation(ArticlePageFollowUserMutation);
  const [unfavoriteArticle] = useMutation(ArticlePageUnfavoriteArticleMutation);
  const [unfollowUser] = useMutation(ArticlePageUnfollowUserMutation);

  if (article.loading) return null;

  return (
    <Layout userUsername={article.data.viewer?.username}>
      <div className="article-page">
        <ArticlePageBanner
          author={article.data.article.author}
          onDelete={deleteArticle}
          onFavorite={favoriteArticle}
          onFollow={followUser}
          onUnfavorite={unfavoriteArticle}
          onUnfollow={unfollowUser}
          {...article.data.article}
        />
        <div className="container page">
          <ArticleContent {...article.data.article} />
          <hr />
          <div className="article-actions">
            <ArticleMeta articleSlug={router.query.slug} />
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              <ArticleCommentList
                viewer={article.data.viewer}
                articleSlug={router.query.slug}
                {...article.data.article}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const ArticlePageQuery = gql`
  query ArticlePageQuery($slug: ID!) {
    viewer {
      username
      ...ArticleCommentListUserFragment
    }
    article: articleBySlug(slug: $slug) {
      slug
      body
      description
      ...ArticleMetaArticleFragment
      ...ArticlePageBannerArticleFragment
      ...ArticleCommentListArticleFragment
    }
  }
  ${ArticleMeta.fragments.article}
  ${ArticlePageBanner.fragments.article}
  ${ArticleCommentList.fragments.article}
  ${ArticleCommentList.fragments.viewer}
`;

const ArticlePageDeleteArticleMutation = gql`
  mutation ArticlePageDeleteArticleMutation($slug: ID!) {
    deleteArticle(slug: $slug) {
      article {
        slug
        body
        description
        ...ArticleMetaArticleFragment
        ...ArticlePageBannerArticleFragment
        ...ArticleCommentListArticleFragment
        author {
          ...ArticlePageBannerUserFragment
        }
      }
    }
  }
  ${ArticleMeta.fragments.article}
  ${ArticlePageBanner.fragments.article}
  ${ArticlePageBanner.fragments.author}
  ${ArticleCommentList.fragments.article}
`;

const ArticlePageFavoriteArticleMutation = gql`
  mutation ArticlePageFavoriteArticleMutation($slug: ID!) {
    favoriteArticle(slug: $slug) {
      article {
        slug
        body
        description
        ...ArticleMetaArticleFragment
        ...ArticlePageBannerArticleFragment
        ...ArticleCommentListArticleFragment
      }
    }
  }
  ${ArticleMeta.fragments.article}
  ${ArticlePageBanner.fragments.article}
  ${ArticleCommentList.fragments.article}
`;

const ArticlePageUnfavoriteArticleMutation = gql`
  mutation ArticlePageUnfavoriteArticleMutation($slug: ID!) {
    unfavoriteArticle(slug: $slug) {
      article {
        slug
        body
        description
        ...ArticleMetaArticleFragment
        ...ArticlePageBannerArticleFragment
        ...ArticleCommentListArticleFragment
      }
    }
  }
  ${ArticleMeta.fragments.article}
  ${ArticlePageBanner.fragments.article}
  ${ArticleCommentList.fragments.article}
`;

const ArticlePageFollowUserMutation = gql`
  mutation ArticlePageFollowUserMutation($username: ID!) {
    followUser(username: $username) {
      user {
        ...ArticlePageBannerUserFragment
      }
    }
  }
  ${ArticlePageBanner.fragments.author}
`;

const ArticlePageUnfollowUserMutation = gql`
  mutation ArticlePageUnfollowUserMutation($username: ID!) {
    unfollowUser(username: $username) {
      user {
        ...ArticlePageBannerUserFragment
      }
    }
  }
  ${ArticlePageBanner.fragments.author}
`;

export default withApollo(ArticlePage);
