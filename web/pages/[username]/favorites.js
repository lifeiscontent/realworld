import React, { useCallback } from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { ArticlePreview } from '../../containers/article-preview';
import { UserInfo } from '../../containers/user-info';
import withApollo from '../../lib/with-apollo';
import { Layout } from '../../components/layout';

const ProfileFavoritesPageQuery = gql`
  query ProfileFavoritesPageQuery($username: String!) {
    viewer {
      ...LayoutUserFragment
    }
    profile: profileByUsername(username: $username) {
      username
      bio
      ...UserInfoProfileFragment
      user {
        id
        favoriteArticlesConnection {
          edges {
            node {
              ...ArticlePreviewArticleFragment
            }
          }
        }
      }
    }
  }
  ${ArticlePreview.fragments.article}
  ${Layout.fragments.user}
  ${UserInfo.fragments.profile}
`;

function ProfileFavoritesPage() {
  const router = useRouter();
  const favorites = useQuery(ProfileFavoritesPageQuery, {
    variables: {
      username: router.query.username
    }
  });

  const handleUnfavoriteArticle = useCallback(
    (proxy, mutationResult) => {
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
          profile: {
            ...data.profile,
            user: {
              ...data.profile.user,
              favoriteArticlesConnection: {
                ...data.profile.user.favoriteArticlesConnection,
                edges: data.profile.user.favoriteArticlesConnection.edges.filter(
                  edge =>
                    edge.node.slug !==
                    mutationResult.data.unfavoriteArticle.article.slug
                )
              }
            }
          }
        }
      });
    },
    [router.query.username]
  );

  if (favorites.loading) return null;

  return (
    <Layout userId={favorites.data.viewer?.id}>
      <div className="profile-page">
        <UserInfo profileUsername={favorites.data.profile.username} />
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <Link
                      href="/[username]"
                      as={`/${favorites.data.profile.username}`}
                    >
                      <a className="nav-link">My Articles</a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      href="/[username]/favorites"
                      as={`/${favorites.data.profile.username}/favorites`}
                    >
                      <a className="nav-link active">Favorited Articles</a>
                    </Link>
                  </li>
                </ul>
              </div>
              {favorites.data.profile.user.favoriteArticlesConnection.edges.map(
                edge => (
                  <ArticlePreview
                    articleSlug={edge.node.slug}
                    key={edge.node.slug}
                    onUnfavoriteArticle={handleUnfavoriteArticle}
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

export default withApollo(ProfileFavoritesPage);
