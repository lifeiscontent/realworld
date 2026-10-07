import { gql, type TypedDocumentNode } from '@apollo/client';
import { useReadQuery } from '@apollo/client/react';
import { type LoaderFunctionArgs, useLoaderData } from 'react-router';

import { apolloClientContext, preloadQueryContext } from '../app/context';
import { viewerContext } from '../app/middleware';
import { ArticleList } from '../features/article/ArticleList';
import { ARTICLE_PREVIEW_FRAGMENT } from '../features/article/ArticlePreview';
import {
  PROFILE_INFO_FRAGMENT,
  ProfileInfo,
} from '../features/profile/ProfileInfo';
import { ProfileTabs } from '../features/profile/ProfileTabs';
import { pageOf } from '../lib/pagination';
import { requireParam } from '../lib/params';
import { notFound } from '../lib/responses';
import type {
  ProfilePageQuery,
  ProfilePageQueryVariables,
} from '../types/__generated__/graphql';
import { Pagination } from '../ui/Pagination';

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
            <ProfileTabs
              username={profile.username}
              tab={favorites ? 'favorites' : 'articles'}
            />
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
