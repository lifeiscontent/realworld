import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import clsx from "clsx";
import { ArticlePreview, Sidebar, FeedToggle } from "../containers";

const FeedPageArticlesQuery = gql`
  query FeedPageArticlesQuery(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $tagName: String
  ) {
    feedConnection(
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
          ...ArticlePreviewArticleFragment
        }
      }
    }
  }
  ${ArticlePreview.fragments.article}
`;

export default function FeedPage(props) {
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

  const articles = useQuery(FeedPageArticlesQuery, {
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
            <FeedToggle />
            {articles.loading ? (
              <div className="article-preview">Loading..</div>
            ) : (
              articles.data.feedConnection.edges.map(edge => (
                <ArticlePreview slug={edge.node.slug} key={edge.node.slug} />
              ))
            )}
            <nav>
              <ul className="pagination">
                <li
                  className={clsx("page-item", {
                    disabled: articles.loading
                      ? true
                      : articles.data.feedConnection.pageInfo
                          .hasPreviousPage === false
                  })}
                >
                  <Link
                    href={{
                      pathname: router.pathname,
                      query: router.query.tagName
                        ? {
                            before: articles.loading
                              ? null
                              : articles.data.feedConnection.pageInfo
                                  .startCursor,
                            last: 10,
                            tagName: router.query.tagName
                          }
                        : {
                            before: articles.loading
                              ? null
                              : articles.data.feedConnection.pageInfo
                                  .startCursor,
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
                    disabled: articles.loading
                      ? true
                      : articles.data.feedConnection.pageInfo.hasNextPage ===
                        false
                  })}
                >
                  <Link
                    href={{
                      pathname: router.pathname,
                      query: router.query.tagName
                        ? {
                            after: articles.loading
                              ? null
                              : articles.data.feedConnection.pageInfo.endCursor,
                            first: 10,
                            tagName: router.query.tagName
                          }
                        : {
                            after: articles.loading
                              ? null
                              : articles.data.feedConnection.pageInfo.endCursor,
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
