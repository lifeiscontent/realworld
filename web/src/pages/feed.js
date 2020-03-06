import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import clsx from 'clsx';
import { ArticlePreview } from '../components/article-preview';
import { Sidebar } from '../components/sidebar';
import { FeedToggle } from '../components/feed-toggle';
import withApollo from '../lib/with-apollo';
import { Layout } from '../components/layout';
import { NetworkStatus } from 'apollo-client';

function FeedPage() {
  const router = useRouter();
  const variables =
    typeof router.query.before !== 'undefined' ||
    typeof router.query.after !== 'undefined'
      ? {
          last: router.query.last ? parseInt(router.query.last) : null,
          first: router.query.first ? parseInt(router.query.first) : null,
          before: router.query.before ? router.query.before : null,
          after: router.query.after ? router.query.after : null,
          tagName: router.query.tagName
        }
      : { first: 10, tagName: router.query.tagName };

  const feed = useQuery(FeedPageQuery, {
    variables,
    notifyOnNetworkStatusChange: true
  });

  const [favoriteArticle] = useMutation(FeedPageFavoriteArticleMutation);
  const [unfavoriteArticle] = useMutation(FeedPageUnfavoriteArticleMutation);

  if (feed.networkStatus === NetworkStatus.loading) return null;

  return (
    <Layout userUsername={feed.data.viewer?.username}>
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
              <FeedToggle userUsername={feed.data.viewer?.username} />
              {feed.data.feedConnection.edges.map(edge => (
                <ArticlePreview
                  key={edge.node.slug}
                  onFavorite={favoriteArticle}
                  onUnfavorite={unfavoriteArticle}
                  {...edge.node}
                />
              ))}
              <nav>
                <ul className="pagination">
                  <li
                    className={clsx('page-item', {
                      disabled:
                        feed.data.feedConnection.pageInfo.hasPreviousPage ===
                        false
                    })}
                  >
                    <Link
                      href={{
                        pathname: router.pathname,
                        query: router.query.tagName
                          ? {
                              before:
                                feed.data.feedConnection.pageInfo.startCursor,
                              last: 10,
                              tagName: router.query.tagName
                            }
                          : {
                              before:
                                feed.data.feedConnection.pageInfo.startCursor,
                              last: 10
                            }
                      }}
                    >
                      <a className="page-link">Previous</a>
                    </Link>
                  </li>
                  <li
                    className={clsx('page-item', {
                      disabled:
                        feed.data.feedConnection.pageInfo.hasNextPage === false
                    })}
                  >
                    <Link
                      href={{
                        pathname: router.pathname,
                        query: router.query.tagName
                          ? {
                              after:
                                feed.data.feedConnection.pageInfo.endCursor,
                              first: 10,
                              tagName: router.query.tagName
                            }
                          : {
                              after:
                                feed.data.feedConnection.pageInfo.endCursor,
                              first: 10
                            }
                      }}
                    >
                      <a className="page-link">Next</a>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="col-xs-12 col-md-3">
              <Sidebar popularTags={feed.data.popularTags} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const FeedPageQuery = gql`
  query FeedPageQuery(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $tagName: String
  ) {
    viewer {
      username
    }
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
    ...SidebarQueryFragment
  }
  ${ArticlePreview.fragments.article}
  ${Sidebar.fragments.query}
`;

const FeedPageFavoriteArticleMutation = gql`
  mutation FeedPageFavoriteArticleMutation($slug: ID!) {
    favoriteArticle(slug: $slug) {
      article {
        ...ArticlePreviewArticleFragment
      }
    }
  }
  ${ArticlePreview.fragments.article}
`;

const FeedPageUnfavoriteArticleMutation = gql`
  mutation FeedPageUnfavoriteArticleMutation($slug: ID!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...ArticlePreviewArticleFragment
      }
    }
  }
  ${ArticlePreview.fragments.article}
`;

export default withApollo(FeedPage);
