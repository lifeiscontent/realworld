import React from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ArticlePreview } from '../components/article-preview';
import { UserInfo } from '../containers/user-info';
import withApollo from '../lib/with-apollo';
import { Layout } from '../components/layout';

function ProfilePage() {
  const router = useRouter();
  const profile = useQuery(ProfilePageQuery, {
    variables: {
      username: router.query.username
    }
  });

  const [favoriteArticle] = useMutation(ProfilePageFavoriteArticleMutation);
  const [unfavoriteArticle] = useMutation(ProfilePageUnfavoriteArticleMutation);

  if (profile.loading) return null;

  return (
    <Layout userUsername={profile.data.viewer?.username}>
      <div className="profile-page">
        <UserInfo userUsername={profile.data.user.username} />
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <Link
                      href="/[username]"
                      as={`/${profile.data.user.username}`}
                    >
                      <a className="nav-link active">My Articles</a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      href="/[username]/favorites"
                      as={`/${profile.data.user.username}/favorites`}
                    >
                      <a className="nav-link">Favorited Articles</a>
                    </Link>
                  </li>
                </ul>
              </div>
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
      ...UserInfoUserFragment
    }
  }
  ${ArticlePreview.fragments.article}
  ${UserInfo.fragments.user}
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

export default withApollo(ProfilePage);
