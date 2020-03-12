import React from 'react';
import gql from 'graphql-tag';
import withApollo from '../lib/with-apollo';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Sidebar } from '../components/sidebar';
import { Pagination } from '../components/pagination';
import { NetworkStatus } from 'apollo-client';
import { Layout } from '../components/layout';
import { HomePageBanner } from '../components/home-page-banner';
import { FeedToggle } from '../components/feed-toggle';
import { ArticlePreview } from '../components/article-preview';

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
        <HomePageBanner />
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
              <Pagination {...feed.data.feedConnection} />
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

const FeedPageArticleFragment = gql`
  fragment FeedPageArticleFragment on Article {
    author {
      username
      profile {
        imageUrl
      }
    }
    canFavorite {
      value
    }
    canUnfavorite {
      value
    }
    createdAt
    description
    favoritesCount
    slug
    tags {
      id
      name
    }
    title
    viewerDidFavorite
  }
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
          ...FeedPageArticleFragment
        }
      }
    }
    popularTags {
      id
      name
    }
  }
  ${FeedPageArticleFragment}
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

export default withApollo(FeedPage);
