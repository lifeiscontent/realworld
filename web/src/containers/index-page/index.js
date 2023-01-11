import { gql, useQuery, useMutation, NetworkStatus } from '@apollo/client';
import { useRouter } from 'next/router';
import { Sidebar } from '../../components/sidebar';
import { Pagination } from '../../components/pagination';
import { HomePageBanner } from '../../components/home-page-banner';
import { ViewerFeedToggle } from '../../components/viewer-feed-toggle';
import { ArticlePreview } from '../../components/article-preview';
import { Layout } from '../layout';

export function queryToVariables({
  before = undefined,
  after = undefined,
  tagName = undefined,
  last = before && !after ? '10' : undefined,
  first = last ? undefined : '10',
} = {}) {
  return {
    last: typeof last === 'string' ? parseInt(last, 10) : undefined,
    first: typeof first === 'string' ? parseInt(first, 10) : undefined,
    before,
    after,
    tagName,
  };
}
function IndexPage() {
  const router = useRouter();

  const page = useQuery(IndexPageQuery, {
    notifyOnNetworkStatusChange: true,
    variables: queryToVariables(router.query),
  });

  const [favoriteArticle] = useMutation(IndexPageFavoriteArticleMutation);
  const [unfavoriteArticle] = useMutation(IndexPageUnfavoriteArticleMutation);

  if (
    page.networkStatus === NetworkStatus.loading ||
    page.networkStatus === NetworkStatus.setVariables
  ) {
    return null;
  }

  return (
    <Layout {...page.data.viewer}>
      <div className="home-page">
        <HomePageBanner />
        <div className="container page">
          <div className="row">
            <div className="col-xs-12 col-md-9">
              <ViewerFeedToggle {...page.data.viewer} />
              {page.data.articlesConnection.edges.map(edge => (
                <ArticlePreview
                  key={edge.node.slug}
                  onFavorite={favoriteArticle}
                  onUnfavorite={unfavoriteArticle}
                  {...edge.node}
                />
              ))}
              <Pagination {...page.data.articlesConnection.pageInfo} />
            </div>
            <div className="col-xs-12 col-md-3">
              <Sidebar {...page.data} />
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
      ...ArticlePreviewAuthorFragment
    }
    ...ArticlePreviewArticleFragment
  }
  ${ArticlePreview.fragments.article}
  ${ArticlePreview.fragments.author}
`;

const IndexPageQuery = gql`
  query IndexPageQuery(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $tagName: String
  ) {
    viewer {
      ...LayoutViewerFragment
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
  ${Layout.fragments.viewer}
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

IndexPage.query = IndexPageQuery;

export default IndexPage;
