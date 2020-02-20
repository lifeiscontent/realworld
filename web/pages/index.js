import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import withApollo from "../lib/with-apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import clsx from "clsx";
import { ArticlePreview, Sidebar } from "../containers";

const HomePageArticlesQuery = gql`
  query HomePageArticlesQuery(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $tagName: String
  ) {
    articles(
      after: $after
      before: $before
      first: $first
      last: $last
      tagName: $tagName
    ) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        cursor
        node {
          id
          slug
          title
          description
          favoritesCount
          createdAt
          author {
            id
            username
            image
          }
        }
      }
    }
  }
`;

function HomePage(props) {
  const router = useRouter();
  const variables =
    typeof router.query.before !== "undefined" ||
    typeof router.query.after !== "undefined"
      ? {
          last: router.query.last ? parseInt(router.query.last) : null,
          first: router.query.first ? parseInt(router.query.first) : null,
          before: router.query.before ? router.query.before : null,
          after: router.query.after ? router.query.after : null,
          tagName: router.query.tagName
        }
      : { first: 10, tagName: router.query.tagName };

  const articles = useQuery(HomePageArticlesQuery, {
    variables
  });

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>
      <div className="container page">
        <div className="row">
          <div className="col-xs-12 col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a className="nav-link disabled" href="/login">
                    Your Feed
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" href="/">
                    Global Feed
                  </a>
                </li>
              </ul>
            </div>
            {articles.loading ? (
              <div className="article-preview">Loading..</div>
            ) : (
              articles.data.articles.edges.map(edge => (
                <ArticlePreview id={edge.node.id} key={edge.node.id} />
              ))
            )}
            <nav>
              <ul className="pagination">
                <li
                  className={clsx("page-item", {
                    disabled:
                      articles.loading === false
                        ? articles.data.articles.pageInfo.hasPreviousPage ===
                          false
                        : true
                  })}
                >
                  <Link
                    href={{
                      pathname: "/",
                      query: router.query.tagName
                        ? {
                            before:
                              articles?.data?.articles?.pageInfo?.startCursor,
                            last: 10,
                            tagName: router.query.tagName
                          }
                        : {
                            before:
                              articles?.data?.articles?.pageInfo?.startCursor,
                            last: 10
                          }
                    }}
                    shallow
                  >
                    <a className="page-link">Previous</a>
                  </Link>
                </li>
                <li
                  className={clsx("page-item", {
                    disabled:
                      articles.loading === false
                        ? articles.data.articles.pageInfo.hasNextPage === false
                        : true
                  })}
                >
                  <Link
                    href={{
                      pathname: "/",
                      query: router.query.tagName
                        ? {
                            after:
                              articles?.data?.articles?.pageInfo?.endCursor,
                            first: 10,
                            tagName: router.query.tagName
                          }
                        : {
                            after:
                              articles?.data?.articles?.pageInfo?.endCursor,
                            first: 10
                          }
                    }}
                    shallow
                  >
                    <a className="page-link">Next</a>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="col-xs-12 col-md-3">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withApollo(HomePage);
