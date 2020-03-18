import React from 'react';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ArticlePreview } from '../../components/article-preview';
import { withLayout } from '../../hocs/with-layout';
import { UserPageBanner } from '../../components/user-page-banner';
import { UserArticlesToggle } from '../../components/user-articles-toggle';

function ProfileFavoritesPage() {
  const router = useRouter();
  const favorites = useQuery(ProfileFavoritesPageQuery, {
    variables: {
      username: router.query.username
    },
    skip: !router.query.username
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
    <div className="profile-page">
      <UserPageBanner
        onFollow={followUser}
        onUnfollow={unfollowUser}
        {...favorites.data.user}
      />
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <UserArticlesToggle username={favorites.data.user.username} />
            {favorites.data.user.favoriteArticlesConnection.edges.map(edge => (
              <ArticlePreview
                key={edge.node.slug}
                onFavorite={favoriteArticle}
                onUnfavorite={unfavoriteArticle}
                {...edge.node}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ProfileFavoritesViewerFragment = gql`
  fragment ProfileFavoritesViewerFragment on User {
    username
    profile {
      imageUrl
    }
  }
`;

const ProfileFavoritesArticleFragment = gql`
  fragment ProfileFavoritesArticleFragment on Article {
    author {
      username
      profile {
        imageUrl
      }
    }
    canFavorite {
      value
    }
    canUnfavorite {
      value
    }
    createdAt
    description
    favoritesCount
    slug
    tags {
      id
      name
    }
    title
    viewerDidFavorite
  }
`;

const ProfileFavoritesUserFragment = gql`
  fragment ProfileFavoritesUserFragment on User {
    username
    favoriteArticlesConnection {
      edges {
        node {
          ...ProfileFavoritesArticleFragment
        }
      }
    }
  }
  ${ProfileFavoritesArticleFragment}
`;

const ProfileFavoritesPageQuery = gql`
  query ProfileFavoritesPageQuery($username: ID!) {
    viewer {
      ...ProfileFavoritesViewerFragment
    }
    user: userByUsername(username: $username) {
      ...ProfileFavoritesUserFragment
    }
  }
  ${ProfileFavoritesViewerFragment}
  ${ProfileFavoritesUserFragment}
`;

const ProfileFavoritesPageFavoriteArticleMutation = gql`
  mutation ProfileFavoritesPageFavoriteArticleMutation($slug: ID!) {
    favoriteArticle(slug: $slug) {
      article {
        ...ProfileFavoritesArticleFragment
      }
    }
  }
  ${ProfileFavoritesArticleFragment}
`;

const ProfileFavoritesPageUnfavoriteArticleMutation = gql`
  mutation ProfileFavoritesPageUnfavoriteArticleMutation($slug: ID!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...ProfileFavoritesArticleFragment
      }
    }
  }
  ${ProfileFavoritesArticleFragment}
`;

const ProfileFavoritesPageFollowUserMutation = gql`
  mutation ProfileFavoritesPageFollowUserMutation($username: ID!) {
    followUser(username: $username) {
      user {
        ...ProfileFavoritesUserFragment
      }
    }
  }
  ${ProfileFavoritesUserFragment}
`;

const ProfileFavortiesPageUnfollowUserMutation = gql`
  mutation ProfileFavortiesPageUnfollowUserMutation($username: ID!) {
    unfollowUser(username: $username) {
      user {
        ...ProfileFavoritesUserFragment
      }
    }
  }
  ${ProfileFavoritesUserFragment}
`;

export default withLayout(ProfileFavoritesPage);
