import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { withLayout } from '../../hocs/with-layout';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Sidebar } from '../../components/sidebar';
import { Pagination } from '../../components/pagination';
import { NetworkStatus } from 'apollo-client';
import { HomePageBanner } from '../../components/home-page-banner';
import { ViewerFeedToggle } from '../../components/viewer-feed-toggle';
import { ArticlePreview } from '../../components/article-preview';

function FeedPage() {
  const router = useRouter();
  const variables =
    typeof router.query.before !== 'undefined' ||
    typeof router.query.after !== 'undefined'
      ? {
          last:
            typeof router.query.last === 'string'
              ? parseInt(router.query.last)
              : null,
          first:
            typeof router.query.first === 'string'
              ? parseInt(router.query.first)
              : null,
          before: router.query.before ? router.query.before : null,
          after: router.query.after ? router.query.after : null,
          tagName: router.query.tagName,
        }
      : { first: 10, tagName: router.query.tagName };

  const feed = useQuery(FeedPageQuery, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  const [favoriteArticle] = useMutation(FeedPageFavoriteArticleMutation);
  const [unfavoriteArticle] = useMutation(FeedPageUnfavoriteArticleMutation);

  useEffect(() => {
    if (
      feed.networkStatus === NetworkStatus.loading ||
      feed.networkStatus === undefined ||
      !!feed.data.viewer
    )
      return;
    router.replace(router.asPath, '/login', { shallow: true });
  }, [feed.data, feed.networkStatus, router]);

  if (
    feed.networkStatus === NetworkStatus.loading ||
    feed.networkStatus === undefined ||
    !feed.data.viewer
  )
    return null;

  return (
    <div className="home-page">
      <HomePageBanner />
      <div className="container page">
        <div className="row">
          <div className="col-xs-12 col-md-9">
            <ViewerFeedToggle {...feed.data.viewer} />
            {feed.data.feedConnection.edges.map(edge => (
              <ArticlePreview
                key={edge.node.slug}
                onFavorite={favoriteArticle}
                onUnfavorite={unfavoriteArticle}
                {...edge.node}
              />
            ))}
            <Pagination {...feed.data.feedConnection.pageInfo} />
          </div>
          <div className="col-xs-12 col-md-3">
            <Sidebar {...feed.data} />
          </div>
        </div>
      </div>
    </div>
  );
}

const FeedPageArticleFragment = gql`
  fragment FeedPageArticleFragment on Article {
    author {
      ...ArticlePreviewAuthorFragment
    }
    ...ArticlePreviewArticleFragment
  }
  ${ArticlePreview.fragments.article}
  ${ArticlePreview.fragments.author}
`;

const FeedPageQuery = gql`
  query FeedPageQuery(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $tagName: String
  ) {
    viewer {
      ...ViewerFeedToggleViewerFragment
    }
    feedConnection(
      after: $after
      before: $before
      first: $first
      last: $last
      tagName: $tagName
    ) {
      pageInfo {
        ...PaginationPageInfoFragment
      }
      edges {
        node {
          ...FeedPageArticleFragment
        }
      }
    }
    ...SidebarQueryFragment
  }
  ${FeedPageArticleFragment}
  ${Pagination.fragments.pageInfo}
  ${Sidebar.fragments.query}
  ${ViewerFeedToggle.fragments.viewer}
`;

const FeedPageFavoriteArticleMutation = gql`
  mutation FeedPageFavoriteArticleMutation($slug: ID!) {
    favoriteArticle(slug: $slug) {
      article {
        ...FeedPageArticleFragment
      }
    }
  }
  ${FeedPageArticleFragment}
`;

const FeedPageUnfavoriteArticleMutation = gql`
  mutation FeedPageUnfavoriteArticleMutation($slug: ID!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...FeedPageArticleFragment
      }
    }
  }
  ${FeedPageArticleFragment}
`;

export default withLayout(FeedPage);
