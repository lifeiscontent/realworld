import React from 'react';
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

function IndexPage() {
  const router = useRouter();
  const {
    before,
    after,
    tagName,
    last = before && !after ? '10' : undefined,
    first = last ? undefined : '10',
  } = router.query;

  const index = useQuery(IndexPageArticlesQuery, {
    variables: {
      last: typeof last === 'string' ? parseInt(last, 10) : undefined,
      first: typeof first === 'string' ? parseInt(first, 10) : undefined,
      before,
      after,
      tagName,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [favoriteArticle] = useMutation(IndexPageFavoriteArticleMutation);
  const [unfavoriteArticle] = useMutation(IndexPageUnfavoriteArticleMutation);

  if (index.networkStatus === NetworkStatus.loading) return null;

  return (
    <div className="home-page">
      <HomePageBanner />
      <div className="container page">
        <div className="row">
          <div className="col-xs-12 col-md-9">
            <ViewerFeedToggle {...index.data.viewer} />
            {index.data.articlesConnection.edges.map(edge => (
              <ArticlePreview
                key={edge.node.slug}
                onFavorite={favoriteArticle}
                onUnfavorite={unfavoriteArticle}
                {...edge.node}
              />
            ))}
            <Pagination {...index.data.articlesConnection.pageInfo} />
          </div>
          <div className="col-xs-12 col-md-3">
            <Sidebar {...index.data} />
          </div>
        </div>
      </div>
    </div>
  );
}

const IndexPageArticleFragment = gql`
  fragment IndexPageArticleFragment on Article {
    author {
      ...ArticlePreviewAuthorFragment
    }
    ...ArticlePreviewArticleFragment
  }
  ${ArticlePreview.fragments.article}
  ${ArticlePreview.fragments.author}
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
      ...ViewerFeedToggleViewerFragment
    }
    articlesConnection(
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
          ...IndexPageArticleFragment
        }
      }
    }
    ...SidebarQueryFragment
  }
  ${IndexPageArticleFragment}
  ${Pagination.fragments.pageInfo}
  ${Sidebar.fragments.query}
  ${ViewerFeedToggle.fragments.viewer}
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

export default withLayout(IndexPage);
