import { gql, useQuery, useMutation, NetworkStatus } from '@apollo/client';
import { useRouter } from 'next/router';
import { ArticlePreview } from '../../components/article-preview';
import { UserPageBanner } from '../../components/user-page-banner';
import { UserArticlesToggle } from '../../components/user-articles-toggle';
import { Layout } from '../layout';

export function queryToVariables({ username = undefined } = {}) {
  return { username };
}

function ProfilePage() {
  const router = useRouter();
  const skip = !router.query.username;
  const page = useQuery(ProfilePageQuery, {
    variables: queryToVariables(router.query),
    skip,
  });

  const [favoriteArticle] = useMutation(ProfilePageFavoriteArticleMutation);
  const [unfavoriteArticle] = useMutation(ProfilePageUnfavoriteArticleMutation);
  const [followUser] = useMutation(ProfilePageFollowUser);
  const [unfollowUser] = useMutation(ProfilePageUnfollowUserMutation);

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
              {page.data.user.articlesConnection.edges.length ? (
                page.data.user.articlesConnection.edges.map(edge => (
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
    viewer {
      ...LayoutViewerFragment
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

ProfilePage.query = ProfilePageQuery;

export default ProfilePage;
