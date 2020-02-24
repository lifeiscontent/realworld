import React from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { ArticlePreview, UserInfo } from '../containers';

const ProfilePageQuery = gql`
  query ProfilePageQuery($username: String!) {
    profile: profileByUsername(username: $username) {
      username
      bio
      ...UserInfoProfileFragment
      user {
        articlesConnection {
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
  ${UserInfo.fragments.profile}
`;

export default function ProfilePage() {
  const router = useRouter();
  const profile = useQuery(ProfilePageQuery, {
    variables: {
      username: router.query.username
    },
    skip: typeof router.query.username === 'undefined'
  });

  return (
    <div className="profile-page">
      <UserInfo username={profile.data?.profile?.username} />

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link
                    href="/[username]"
                    as={`/${profile.data?.profile?.username}`}
                    shallow
                  >
                    <a className="nav-link active">My Articles</a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/[username]/favorites"
                    as={`/${profile.data?.profile?.username}/favorites`}
                    shallow
                  >
                    <a className="nav-link">Favorited Articles</a>
                  </Link>
                </li>
              </ul>
            </div>
            {profile.loading ? (
              <div className="article-preview">Loading...</div>
            ) : null}
            {profile.data?.profile?.user?.articlesConnection?.edges?.map(
              edge => (
                <ArticlePreview slug={edge.node.slug} key={edge.node.slug} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
