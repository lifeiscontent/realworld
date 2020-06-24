import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { ArticleContent } from '../../components/article-content';
import { ArticlePageBanner } from '../../components/article-page-banner';
import { ArticleMeta } from '../../components/article-meta';
import { ArticleComments } from '../article-comments';
import { NetworkStatus } from 'apollo-client';
import { Layout } from '../layout';

export function queryToVariables({ slug = undefined } = {}) {
  return { slug };
}

function ArticlePage() {
  const router = useRouter();
  const skip = !router.query.slug;
  const article = useQuery(ArticlePageQuery, {
    variables: queryToVariables(router.query),
    skip,
  });

  const [deleteArticle] = useMutation(ArticlePageDeleteArticleMutation);
  const [favoriteArticle] = useMutation(ArticlePageFavoriteArticleMutation);
  const [followUser] = useMutation(ArticlePageFollowUserMutation);
  const [unfavoriteArticle] = useMutation(ArticlePageUnfavoriteArticleMutation);
  const [unfollowUser] = useMutation(ArticlePageUnfollowUserMutation);

  if (article.networkStatus === NetworkStatus.loading || skip) {
    return null;
  }

  return (
    <Layout>
      <div className="article-page">
        <ArticlePageBanner
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
            <ArticleMeta
              onDelete={deleteArticle}
              onFavorite={favoriteArticle}
              onFollow={followUser}
              onUnfavorite={unfavoriteArticle}
              onUnfollow={unfollowUser}
              {...article.data.article}
            />
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              <ArticleComments articleSlug={router.query.slug} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const ArticlePageAuthorFragment = gql`
  fragment ArticlePageAuthorFragment on User {
    ...ArticlePageBannerAuthorFragment
    ...ArticleMetaAuthorFragment
  }

  ${ArticlePageBanner.fragments.author}
  ${ArticleMeta.fragments.author}
`;

const ArticlePageArticleFragment = gql`
  fragment ArticlePageArticleFragment on Article {
    author {
      ...ArticlePageAuthorFragment
    }
    ...ArticleCommentsArticleFragment
    ...ArticleContentArticleFragment
    ...ArticleMetaArticleFragment
    ...ArticlePageBannerArticleFragment
  }
  ${ArticleComments.fragments.article}
  ${ArticleContent.fragments.article}
  ${ArticlePageAuthorFragment}
  ${ArticlePageBanner.fragments.article}
  ${ArticleMeta.fragments.article}
`;

const ArticlePageViewerFragment = gql`
  fragment ArticlePageViewerFragment on User {
    ...ArticleCommentsViewerFragment
  }
  ${ArticleComments.fragments.viewer}
`;

export const ArticlePageQuery = gql`
  query ArticlePageQuery($slug: ID!) {
    viewer {
      ...ArticlePageViewerFragment
    }
    article: articleBySlug(slug: $slug) {
      ...ArticlePageArticleFragment
    }
  }
  ${ArticlePageArticleFragment}
  ${ArticlePageViewerFragment}
`;

const ArticlePageDeleteArticleMutation = gql`
  mutation ArticlePageDeleteArticleMutation($slug: ID!) {
    deleteArticle(slug: $slug) {
      article {
        ...ArticlePageArticleFragment
      }
    }
  }
  ${ArticlePageArticleFragment}
`;

const ArticlePageFavoriteArticleMutation = gql`
  mutation ArticlePageFavoriteArticleMutation($slug: ID!) {
    favoriteArticle(slug: $slug) {
      article {
        ...ArticlePageArticleFragment
      }
    }
  }
  ${ArticlePageArticleFragment}
`;

const ArticlePageUnfavoriteArticleMutation = gql`
  mutation ArticlePageUnfavoriteArticleMutation($slug: ID!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...ArticlePageArticleFragment
      }
    }
  }
  ${ArticlePageArticleFragment}
`;

const ArticlePageFollowUserMutation = gql`
  mutation ArticlePageFollowUserMutation($username: ID!) {
    followUser(username: $username) {
      user {
        ...ArticlePageAuthorFragment
      }
    }
  }
  ${ArticlePageAuthorFragment}
`;

const ArticlePageUnfollowUserMutation = gql`
  mutation ArticlePageUnfollowUserMutation($username: ID!) {
    unfollowUser(username: $username) {
      user {
        ...ArticlePageAuthorFragment
      }
    }
  }
  ${ArticlePageAuthorFragment}
`;

ArticlePage.query = ArticlePageQuery;

export default ArticlePage;
