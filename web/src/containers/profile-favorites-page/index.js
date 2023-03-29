import { gql, useQuery, useMutation, NetworkStatus } from '@apollo/client';
import { useRouter } from 'next/router';
import { ArticlePreview } from '../../components/article-preview';
import { UserPageBanner } from '../../components/user-page-banner';
import { UserArticlesToggle } from '../../components/user-articles-toggle';
import { Layout } from '../layout';

export function queryToVariables({ username = undefined } = {}) {
  return { username };
}

function ProfileFavoritesPage() {
  const router = useRouter();
  const skip = !router.query.username;
  const page = useQuery(ProfileFavoritesPageQuery, {
    variables: queryToVariables(router.query),
    skip,
  });

  const [favoriteArticle] = useMutation(
    ProfileFavoritesPageFavoriteArticleMutation
  );
  const [unfavoriteArticle] = useMutation(
    ProfileFavoritesPageUnfavoriteArticleMutation
  );
  const [followUser] = useMutation(ProfileFavoritesPageFollowUser);
  const [unfollowUser] = useMutation(ProfileFavoritesPageUnfollowUserMutation);

  if (
    page.networkStatus === NetworkStatus.loading ||
    page.networkStatus === NetworkStatus.setVariables ||
    skip
  )
    return null;

  return (
    <Layout {...page.data.viewer}>
      <div className="profile-page">
        <UserPageBanner
          onFollow={followUser}
          onUnfollow={unfollowUser}
          {...page.data.user}
        />
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <UserArticlesToggle {...page.data.user} />
              {page.data.user.favoriteArticlesConnection.edges.length ? (
                page.data.user.favoriteArticlesConnection.edges.map(edge => (
                  <ArticlePreview
                    key={edge.node.slug}
                    onUnfavorite={unfavoriteArticle}
                    onFavorite={favoriteArticle}
                    {...edge.node}
                  />
                ))
              ) : (
                <div className="article-preview">No articles</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const ProfileFavoritesPageUserFragment = gql`
  fragment ProfileFavoritesPageUserFragment on User {
    ...UserPageBannerUserFragment
    ...UserArticlesToggleUserFragment
  }
  ${UserPageBanner.fragments.user}
  ${UserArticlesToggle.fragments.user}
`;

const ProfileFavoritesPageArticleFragment = gql`
  fragment ProfileFavoritesPageArticleFragment on Article {
    author {
      ...ArticlePreviewAuthorFragment
    }
    ...ArticlePreviewArticleFragment
  }
  ${ArticlePreview.fragments.article}
  ${ArticlePreview.fragments.author}
`;

const ProfileFavoritesPageQuery = gql`
  query ProfileFavoritesPageQuery($username: ID!) {
    user: userByUsername(username: $username) {
      ...ProfileFavoritesPageUserFragment
      favoriteArticlesConnection {
        edges {
          node {
            ...ProfileFavoritesPageArticleFragment
          }
        }
      }
    }
    viewer {
      ...LayoutViewerFragment
    }
  }
  ${Layout.fragments.viewer}
  ${ProfileFavoritesPageUserFragment}
  ${ProfileFavoritesPageArticleFragment}
`;

const ProfileFavoritesPageFavoriteArticleMutation = gql`
  mutation ProfileFavoritesPageFavoriteArticleMutation($slug: ID!) {
    favoriteArticle(slug: $slug) {
      article {
        ...ProfileFavoritesPageArticleFragment
      }
    }
  }
  ${ProfileFavoritesPageArticleFragment}
`;

const ProfileFavoritesPageUnfavoriteArticleMutation = gql`
  mutation ProfileFavoritesPageUnfavoriteArticleMutation($slug: ID!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...ProfileFavoritesPageArticleFragment
      }
    }
  }
  ${ProfileFavoritesPageArticleFragment}
`;

const ProfileFavoritesPageFollowUser = gql`
  mutation ProfileFavoritesPageFollowUser($username: ID!) {
    followUser(username: $username) {
      user {
        ...ProfileFavoritesPageUserFragment
      }
    }
  }
  ${ProfileFavoritesPageUserFragment}
`;

const ProfileFavoritesPageUnfollowUserMutation = gql`
  mutation ProfileFavoritesPageUnfollowUserMutation($username: ID!) {
    unfollowUser(username: $username) {
      user {
        ...ProfileFavoritesPageUserFragment
      }
    }
  }
  ${ProfileFavoritesPageUserFragment}
`;

ProfileFavoritesPage.query = ProfileFavoritesPageQuery;

export default ProfileFavoritesPage;
