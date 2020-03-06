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
import { HomePageBanner } from '../components/home-page-banner';

function IndexPage() {
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

  const index = useQuery(IndexPageArticlesQuery, {
    variables,
    notifyOnNetworkStatusChange: true
  });

  const [favoriteArticle] = useMutation(IndexPageFavoriteArticleMutation);
  const [unfavoriteArticle] = useMutation(IndexPageUnfavoriteArticleMutation);

  if (index.networkStatus == NetworkStatus.loading) return null;

  return (
    <Layout userUsername={index.data.viewer?.username}>
      <div className="home-page">
        <HomePageBanner />
        <div className="container page">
          <div className="row">
            <div className="col-xs-12 col-md-9">
              <FeedToggle userUsername={index.data.viewer?.username} />
              {index.data.articlesConnection.edges.map(edge => (
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
                        index.data.articlesConnection.pageInfo
                          .hasPreviousPage === false
                    })}
                  >
                    <Link
                      href={{
                        pathname: '/',
                        query: router.query.tagName
                          ? {
                              before:
                                index.data.articlesConnection.pageInfo
                                  .startCursor,
                              last: 10,
                              tagName: router.query.tagName
                            }
                          : {
                              before:
                                index.data.articlesConnection.pageInfo
                                  .startCursor,
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
                        index.data.articlesConnection.pageInfo.hasNextPage ===
                        false
                    })}
                  >
                    <Link
                      href={{
                        pathname: '/',
                        query: router.query.tagName
                          ? {
                              after:
                                index.data.articlesConnection.pageInfo
                                  .endCursor,
                              first: 10,
                              tagName: router.query.tagName
                            }
                          : {
                              after:
                                index.data.articlesConnection.pageInfo
                                  .endCursor,
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
              <Sidebar popularTags={index.data.popularTags} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const IndexPageArticlesQuery = gql`
  query IndexPageArticlesQuery(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $tagName: String
  ) {
    viewer {
      username
    }
    articlesConnection(
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

const IndexPageFavoriteArticleMutation = gql`
  mutation IndexPageFavoriteArticleMutation($slug: ID!) {
    favoriteArticle(slug: $slug) {
      article {
        ...ArticlePreviewArticleFragment
      }
    }
  }
  ${ArticlePreview.fragments.article}
`;

const IndexPageUnfavoriteArticleMutation = gql`
  mutation IndexPageUnfavoriteArticleMutation($slug: ID!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...ArticlePreviewArticleFragment
      }
    }
  }
  ${ArticlePreview.fragments.article}
`;

export default withApollo(IndexPage);
