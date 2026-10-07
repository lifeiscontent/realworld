import { useReadQuery } from '@apollo/client/react';
import {
  Link,
  redirect,
  useLoaderData,
  type LoaderFunctionArgs,
} from 'react-router';
import { preloadQueryContext } from '../app/context';
import { viewerContext } from '../app/middleware';
import { ArticleList } from '../components/ArticleList';
import { FeedToggle } from '../components/FeedToggle';
import { Pagination } from '../components/Pagination';
import { PopularTags } from '../components/PopularTags';
import { pageOf } from '../lib/pagination';
import { paths } from '../lib/paths';
import { gql, type TypedDocumentNode } from '@apollo/client';
import { ARTICLE_PREVIEW_FRAGMENT } from '../components/ArticlePreview';
import type {
  HomePageQuery,
  HomePageQueryVariables,
} from '../types/__generated__/graphql';

export { shouldRevalidate } from '../app/revalidation';

export const HOME_PAGE_QUERY: TypedDocumentNode<
  HomePageQuery,
  HomePageQueryVariables
> = gql`
  query HomePage(
    $limit: Int!
    $offset: Int!
    $tag: String
    $following: Boolean!
  ) {
    articles(limit: $limit, offset: $offset, tag: $tag) @skip(if: $following) {
      articles {
        ...ArticlePreview_article
      }
      articlesCount
    }
    feed(limit: $limit, offset: $offset) @include(if: $following) {
      articles {
        ...ArticlePreview_article
      }
      articlesCount
    }
    tags
  }
  ${ARTICLE_PREVIEW_FRAGMENT}
`;

/** "/", "/?feed=following", and "/tag/:tag", each with ?page=N. */
export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const tag = params.tag;
  const signedIn = !!context.get(viewerContext);
  const following = !tag && url.searchParams.get('feed') === 'following';
  if (following && !signedIn) throw redirect(paths.login());

  const { page, limit, offset } = pageOf(url);
  const preloadQuery = context.get(preloadQueryContext);
  const homeRef = await preloadQuery.toPromise(
    preloadQuery(HOME_PAGE_QUERY, {
      variables: { limit, offset, tag, following },
      fetchPolicy: 'cache-and-network',
    })
  );

  return { homeRef, page, tag, following, signedIn };
}

export function Component() {
  const { homeRef, page, tag, following, signedIn } =
    useLoaderData<typeof loader>();
  const { data } = useReadQuery(homeRef);
  const list = (following ? data.feed : data.articles) ?? {
    articles: [],
    articlesCount: 0,
  };

  return (
    <div className="home-page">
      <title>{tag ? `#${tag} | Conduit` : 'Home | Conduit'}</title>
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <FeedToggle
              showYourFeed={signedIn}
              feed={following ? 'following' : tag ? 'tag' : 'global'}
              tag={tag}
            />
            <ArticleList
              articles={list.articles}
              emptyMessage={
                following ? (
                  <>
                    Your feed is empty. Follow other users to see their articles
                    here, or read the <Link to={paths.home()}>Global Feed</Link>
                    .
                  </>
                ) : undefined
              }
            />
            <Pagination currentPage={page} totalCount={list.articlesCount} />
          </div>
          <div className="col-md-3">
            <PopularTags tags={data.tags} />
          </div>
        </div>
      </div>
    </div>
  );
}
