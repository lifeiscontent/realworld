import { useReadQuery } from '@apollo/client/react';
import { clsx } from 'clsx';
import { Link, useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { apolloClientContext, preloadQueryContext } from '../app/context';
import { viewerContext } from '../app/middleware';
import { ArticleList } from '../components/ArticleList';
import { Pagination } from '../components/Pagination';
import { ProfileInfo } from '../components/ProfileInfo';
import { pageOf } from '../lib/pagination';
import { requireParam } from '../lib/params';
import { paths } from '../lib/paths';
import { notFound } from '../lib/responses';
import { gql, type TypedDocumentNode } from '@apollo/client';
import { ARTICLE_PREVIEW_FRAGMENT } from '../components/ArticlePreview';
import { PROFILE_INFO_FRAGMENT } from '../components/ProfileInfo';
import type {
  ProfilePageQuery,
  ProfilePageQueryVariables,
} from '../types/__generated__/graphql';

export { shouldRevalidate } from '../app/revalidation';

export const PROFILE_PAGE_QUERY: TypedDocumentNode<
  ProfilePageQuery,
  ProfilePageQueryVariables
> = gql`
  query ProfilePage(
    $username: String!
    $author: String
    $favorited: String
    $limit: Int!
    $offset: Int!
  ) {
    profile(username: $username) {
      ...ProfileInfo_profile
    }
    articles(
      author: $author
      favorited: $favorited
      limit: $limit
      offset: $offset
    ) {
      articles {
        ...ArticlePreview_article
      }
      articlesCount
    }
  }
  ${ARTICLE_PREVIEW_FRAGMENT}
  ${PROFILE_INFO_FRAGMENT}
`;

/**
 * GET /profile/:username lists the articles of the user, and
 * /profile/:username/favorites the articles that the user favorited.
 */
export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const username = requireParam(params, 'username');
  if (params.tab !== undefined && params.tab !== 'favorites') {
    throw notFound('This page does not exist.');
  }
  const favorites = params.tab === 'favorites';
  const { page, limit, offset } = pageOf(new URL(request.url));
  const variables = {
    username,
    author: favorites ? undefined : username,
    favorited: favorites ? username : undefined,
    limit,
    offset,
  };

  const preloadQuery = context.get(preloadQueryContext);
  const profileRef = await preloadQuery.toPromise(
    preloadQuery(PROFILE_PAGE_QUERY, {
      variables,
      fetchPolicy: 'cache-and-network',
    })
  );

  const cached = context
    .get(apolloClientContext)
    .readQuery({ query: PROFILE_PAGE_QUERY, variables });
  if (!cached?.profile) throw notFound('This profile does not exist.');

  return {
    profileRef,
    favorites,
    page,
    isViewer: context.get(viewerContext)?.username === username,
  };
}

export function Component() {
  const { profileRef, favorites, page, isViewer } =
    useLoaderData<typeof loader>();
  const { data, dataState } = useReadQuery(profileRef);
  if (dataState !== 'complete' || !data.profile) return null;
  const { profile, articles } = data;

  return (
    <div className="profile-page">
      <title>{`${profile.username} | Conduit`}</title>
      <ProfileInfo profile={profile} isViewer={isViewer} />
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link
                    className={clsx('nav-link', { active: !favorites })}
                    to={paths.profile(profile.username)}
                  >
                    My Articles
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={clsx('nav-link', { active: favorites })}
                    to={paths.profileFavorites(profile.username)}
                  >
                    Favorited Articles
                  </Link>
                </li>
              </ul>
            </div>
            <ArticleList articles={articles.articles} />
            <Pagination
              currentPage={page}
              totalCount={articles.articlesCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
