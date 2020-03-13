import React from 'react';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ArticlePreview } from '../components/article-preview';
import withApollo from '../lib/with-apollo';
import { Layout } from '../components/layout';
import { UserPageBanner } from '../components/user-page-banner';
import { UserArticlesToggle } from '../components/user-articles-toggle';

function ProfilePage() {
  const router = useRouter();
  const profile = useQuery(ProfilePageQuery, {
    variables: {
      username: router.query.username
    }
  });

  const [favoriteArticle] = useMutation(ProfilePageFavoriteArticleMutation);
  const [unfavoriteArticle] = useMutation(ProfilePageUnfavoriteArticleMutation);
  const [followUser] = useMutation(ProfilePageFollowUser);
  const [unfollowUser] = useMutation(ProfilePageUnfollowUserMutation);

  if (profile.loading) return null;

  return (
    <Layout {...profile.data.viewer}>
      <div className="profile-page">
        <UserPageBanner
          onFollow={followUser}
          onUnfollow={unfollowUser}
          {...profile.data.user}
        />
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <UserArticlesToggle {...profile.data.user} />
              {profile.data.user.articlesConnection.edges.map(edge => (
                <ArticlePreview
                  key={edge.node.slug}
                  onUnfavorite={unfavoriteArticle}
                  onFavorite={favoriteArticle}
                  {...edge.node}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const ProfilePageUserFragment = gql`
  fragment ProfilePageUserFragment on User {
    ...UserPageBannerUserFragment
    ...UserArticlesToggleUserFragment
  }
  ${UserPageBanner.fragments.user}
  ${UserArticlesToggle.fragments.user}
`;

const ProfilePageArticleFragment = gql`
  fragment ProfilePageArticleFragment on Article {
    author {
      ...ArticlePreviewAuthorFragment
    }
    ...ArticlePreviewArticleFragment
  }
  ${ArticlePreview.fragments.article}
  ${ArticlePreview.fragments.author}
`;

const ProfilePageQuery = gql`
  query ProfilePageQuery($username: ID!) {
    viewer {
      ...LayoutViewerFragment
    }
    user: userByUsername(username: $username) {
      ...ProfilePageUserFragment
      articlesConnection {
        edges {
          node {
            ...ProfilePageArticleFragment
          }
        }
      }
    }
  }
  ${Layout.fragments.viewer}
  ${ProfilePageUserFragment}
  ${ProfilePageArticleFragment}
`;

const ProfilePageFavoriteArticleMutation = gql`
  mutation ProfilePageFavoriteArticleMutation($slug: ID!) {
    favoriteArticle(slug: $slug) {
      article {
        ...ProfilePageArticleFragment
      }
    }
  }
  ${ProfilePageArticleFragment}
`;

const ProfilePageUnfavoriteArticleMutation = gql`
  mutation ProfilePageUnfavoriteArticleMutation($slug: ID!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...ProfilePageArticleFragment
      }
    }
  }
  ${ProfilePageArticleFragment}
`;

const ProfilePageFollowUser = gql`
  mutation ProfilePageFollowUser($username: ID!) {
    followUser(username: $username) {
      user {
        ...ProfilePageUserFragment
      }
    }
  }
  ${ProfilePageUserFragment}
`;

const ProfilePageUnfollowUserMutation = gql`
  mutation ProfilePageUnfollowUserMutation($username: ID!) {
    unfollowUser(username: $username) {
      user {
        ...ProfilePageUserFragment
      }
    }
  }
  ${ProfilePageUserFragment}
`;

export default withApollo(ProfilePage);
