import React from 'react';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ArticlePreview } from '../../components/article-preview';
import withApollo from '../../lib/with-apollo';
import { Layout } from '../../components/layout';
import { ProfilePageBanner } from '../../components/profile-page-banner';
import { ArticlesToggle } from '../../components/articles-toggle';

function ProfileFavoritesPage() {
  const router = useRouter();
  const favorites = useQuery(ProfileFavoritesPageQuery, {
    variables: {
      username: router.query.username
    }
  });

  const [favoriteArticle] = useMutation(
    ProfileFavoritesPageFavoriteArticleMutation
  );
  const [unfavoriteArticle] = useMutation(
    ProfileFavoritesPageUnfavoriteArticleMutation,
    {
      update(proxy, mutationResult) {
        const data = proxy.readQuery({
          query: ProfileFavoritesPageQuery,
          variables: {
            username: router.query.username
          }
        });

        proxy.writeQuery({
          query: ProfileFavoritesPageQuery,
          variables: {
            username: router.query.username
          },
          data: {
            ...data,
            user: {
              ...data.user,
              favoriteArticlesConnection: {
                ...data.user.favoriteArticlesConnection,
                edges: data.user.favoriteArticlesConnection.edges.filter(
                  edge =>
                    edge.node.slug !==
                    mutationResult.data.unfavoriteArticle.article.slug
                )
              }
            }
          }
        });
      }
    }
  );

  const [followUser] = useMutation(ProfileFavoritesPageFollowUserMutation);
  const [unfollowUser] = useMutation(ProfileFavortiesPageUnfollowUserMutation);

  if (favorites.loading) return null;

  return (
    <Layout userUsername={favorites.data.viewer?.username}>
      <div className="profile-page">
        <ProfilePageBanner
          onFollow={followUser}
          onUnfollow={unfollowUser}
          {...favorites.data.user}
        />
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <ArticlesToggle username={favorites.data.user.username} />
              {favorites.data.user.favoriteArticlesConnection.edges.map(
                edge => (
                  <ArticlePreview
                    key={edge.node.slug}
                    onFavorite={favoriteArticle}
                    onUnfavorite={unfavoriteArticle}
                    {...edge.node}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const ProfileFavoritesPageQuery = gql`
  query ProfileFavoritesPageQuery($username: ID!) {
    viewer {
      username
    }
    user: userByUsername(username: $username) {
      username
      favoriteArticlesConnection {
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

const ProfileFavoritesPageFavoriteArticleMutation = gql`
  mutation ProfileFavoritesPageFavoriteArticleMutation($slug: ID!) {
    favoriteArticle(slug: $slug) {
      article {
        ...ArticlePreviewArticleFragment
      }
    }
  }
  ${ArticlePreview.fragments.article}
`;

const ProfileFavoritesPageUnfavoriteArticleMutation = gql`
  mutation ProfileFavoritesPageUnfavoriteArticleMutation($slug: ID!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...ArticlePreviewArticleFragment
      }
    }
  }
  ${ArticlePreview.fragments.article}
`;

const ProfileFavoritesPageFollowUserMutation = gql`
  mutation ProfileFavoritesPageFollowUserMutation($username: ID!) {
    followUser(username: $username) {
      user {
        ...ProfilePageBannerUserFragment
      }
    }
  }
  ${ProfilePageBanner.fragments.user}
`;

const ProfileFavortiesPageUnfollowUserMutation = gql`
  mutation ProfileFavortiesPageUnfollowUserMutation($username: ID!) {
    unfollowUser(username: $username) {
      user {
        ...ProfilePageBannerUserFragment
      }
    }
  }
  ${ProfilePageBanner.fragments.user}
`;

export default withApollo(ProfileFavoritesPage);
