import React from "react";
import Link from "next/link";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import { ArticlePreview } from "../../containers";

const ProfileFavoritesPageQuery = gql`
  query ProfileFavoritesPageQuery($username: String!) {
    profile(username: $username) {
      username
      bio
      favoriteArticlesConnection {
        edges {
          node {
            ...ArticlePreviewArticleFragment
          }
        }
      }
    }
  }
  ${ArticlePreview.fragments.article}
`;

export default function ProfileFavoritesPage(props) {
  const router = useRouter();
  const profile = useQuery(ProfileFavoritesPageQuery, {
    variables: {
      username: router.query.username
    },
    skip: typeof router.query.username === "undefined"
  });

  if (typeof profile.data === "undefined")
    return <div className="profile-page">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                src={
                  profile.data.profile.imageUrl ?? "/images/smiley-cyrus.jpg"
                }
                className="user-img"
              />
              <h4>{profile.data.profile.username}</h4>
              <p>{profile.data.profile.bio}</p>
              <button className="btn btn-sm btn-outline-secondary action-btn">
                <i className="ion-plus-round" />
                &nbsp; Follow {profile.data.profile.username}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link
                    href="/[username]"
                    as={`/${profile.data.profile.username}`}
                    shallow
                  >
                    <a className="nav-link">My Articles</a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/[username]/favorites"
                    as={`/${profile.data.profile.username}/favorites`}
                    shallow
                  >
                    <a className="nav-link active">Favorited Articles</a>
                  </Link>
                </li>
              </ul>
            </div>
            {profile.data.profile.favoriteArticlesConnection.edges.map(edge => (
              <ArticlePreview slug={edge.node.slug} key={edge.node.slug} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
