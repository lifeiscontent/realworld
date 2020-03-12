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
              <Pagination {...index.data.articlesConnection} />
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

const IndexPageArticleFragment = gql`
  fragment IndexPageArticleFragment on Article {
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
          ...IndexPageArticleFragment
        }
      }
    }
    popularTags {
      id
      name
    }
  }
  ${IndexPageArticleFragment}
`;

const IndexPageFavoriteArticleMutation = gql`
  mutation IndexPageFavoriteArticleMutation($slug: ID!) {
    favoriteArticle(slug: $slug) {
      article {
        ...IndexPageArticleFragment
      }
    }
  }
  ${IndexPageArticleFragment}
`;

const IndexPageUnfavoriteArticleMutation = gql`
  mutation IndexPageUnfavoriteArticleMutation($slug: ID!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...IndexPageArticleFragment
      }
    }
  }
  ${IndexPageArticleFragment}
`;

export default withApollo(IndexPage);
