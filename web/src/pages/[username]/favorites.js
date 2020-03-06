import React from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ArticlePreview } from '../../components/article-preview';
import { UserInfo } from '../../containers/user-info';
import withApollo from '../../lib/with-apollo';
import { Layout } from '../../components/layout';

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

  if (favorites.loading) return null;

  return (
    <Layout userUsername={favorites.data.viewer?.username}>
      <div className="profile-page">
        <UserInfo userUsername={favorites.data.user.username} />
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <Link
                      href="/[username]"
                      as={`/${favorites.data.user.username}`}
                    >
                      <a className="nav-link">My Articles</a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      href="/[username]/favorites"
                      as={`/${favorites.data.user.username}/favorites`}
                    >
                      <a className="nav-link active">Favorited Articles</a>
                    </Link>
                  </li>
                </ul>
              </div>
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
      ...UserInfoUserFragment
    }
  }
  ${ArticlePreview.fragments.article}
  ${UserInfo.fragments.user}
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

export default withApollo(ProfileFavoritesPage);
