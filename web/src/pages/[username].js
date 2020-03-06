import React from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { ArticlePreview } from '../containers/article-preview';
import { UserInfo } from '../containers/user-info';
import withApollo from '../lib/with-apollo';
import { Layout } from '../components/layout';

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

function ProfilePage() {
  const router = useRouter();
  const profile = useQuery(ProfilePageQuery, {
    variables: {
      username: router.query.username
    }
  });

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
                  articleSlug={edge.node.slug}
                  key={edge.node.slug}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withApollo(ProfilePage);
