import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { ArticleContent } from '../../components/article-content';
import { ArticlePageBanner } from '../../components/article-page-banner';
import { ArticleMeta } from '../../components/article-meta';
import withApollo from '../../lib/with-apollo';
import { Layout } from '../../components/layout';
import { ArticleComments } from '../../containers/article-comments';

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
    username
    profile {
      imageUrl
    }
    canFollow {
      value
    }
    canUnfollow {
      value
    }
    viewerIsFollowing
    followersCount
  }
`;

const ArticlePageArticleFragment = gql`
  fragment ArticlePageArticleFragment on Article {
    author {
      ...ArticlePageAuthorFragment
    }
    body
    canFavorite {
      value
    }
    canDelete {
      value
    }
    canUnfavorite {
      value
    }
    canUpdate {
      value
    }
    createdAt
    description
    favoritesCount
    slug
    title
    viewerDidFavorite
    ...ArticleCommentsArticleFragment
  }
  ${ArticlePageAuthorFragment}
  ${ArticleComments.fragments.article}
`;

const ArticlePageViewerFragment = gql`
  fragment ArticlePageViewerFragment on User {
    username
    ...ArticleCommentsViewerFragment
  }
  ${ArticleComments.fragments.viewer}
`;

const ArticlePageQuery = gql`
  query ArticlePageQuery($slug: ID!) {
    viewer {
      ...ArticlePageViewerFragment
    }
    article: articleBySlug(slug: $slug) {
      ...ArticlePageArticleFragment
    }
  }
  ${ArticlePageViewerFragment}
  ${ArticlePageArticleFragment}
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

export default withApollo(ArticlePage);
