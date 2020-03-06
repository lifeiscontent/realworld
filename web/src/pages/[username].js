import React from 'react';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ArticlePreview } from '../components/article-preview';
import withApollo from '../lib/with-apollo';
import { Layout } from '../components/layout';
import { ProfilePageBanner } from '../components/profile-page-banner';
import { ArticlesToggle } from '../components/articles-toggle';

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
    <Layout userUsername={profile.data.viewer?.username}>
      <div className="profile-page">
        <ProfilePageBanner
          onFollow={followUser}
          onUnfollow={unfollowUser}
          {...profile.data.user}
        />
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <ArticlesToggle username={profile.data.user.username} />
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

const ProfilePageQuery = gql`
  query ProfilePageQuery($username: ID!) {
    viewer {
      username
    }
    user: userByUsername(username: $username) {
      username
      articlesConnection {
        edges {
          node {
            ...ArticlePreviewArticleFragment
          }
        }
      }
      ...ProfilePageBannerUserFragment
    }
  }
  ${ArticlePreview.fragments.article}
  ${ProfilePageBanner.fragments.user}
`;

const ProfilePageFavoriteArticleMutation = gql`
  mutation ProfilePageFavoriteArticleMutation($slug: ID!) {
    favoriteArticle(slug: $slug) {
      article {
        ...ArticlePreviewArticleFragment
      }
    }
  }
  ${ArticlePreview.fragments.article}
`;

const ProfilePageUnfavoriteArticleMutation = gql`
  mutation ProfilePageUnfavoriteArticleMutation($slug: ID!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...ArticlePreviewArticleFragment
      }
    }
  }
  ${ArticlePreview.fragments.article}
`;

const ProfilePageFollowUser = gql`
  mutation ProfilePageFollowUser($username: ID!) {
    followUser(username: $username) {
      user {
        ...ProfilePageBannerUserFragment
      }
    }
  }
  ${ProfilePageBanner.fragments.user}
`;

const ProfilePageUnfollowUserMutation = gql`
  mutation ProfilePageUnfollowUserMutation($username: ID!) {
    unfollowUser(username: $username) {
      user {
        ...ProfilePageBannerUserFragment
      }
    }
  }
  ${ProfilePageBanner.fragments.user}
`;

export default withApollo(ProfilePage);
