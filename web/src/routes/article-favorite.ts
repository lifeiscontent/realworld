import { gql, type TypedDocumentNode } from '@apollo/client';

import { apolloClientContext } from '../app/context';
import { actionOk, attempt } from '../lib/forms';
import { actionOnlyLoader, methodNotAllowed } from '../lib/responses';
import type {
  FavoriteArticleMutation,
  FavoriteArticleMutationVariables,
  FavoriteStateFragment,
  UnfavoriteArticleMutation,
  UnfavoriteArticleMutationVariables,
} from '../types/__generated__/graphql';
import type { Route } from './+types/article-favorite';

export const clientLoader = actionOnlyLoader;

const FAVORITE_STATE_FRAGMENT: TypedDocumentNode<FavoriteStateFragment> = gql`
  fragment FavoriteState on Article {
    slug
    favorited
    favoritesCount
  }
`;

const FAVORITE_ARTICLE_MUTATION: TypedDocumentNode<
  FavoriteArticleMutation,
  FavoriteArticleMutationVariables
> = gql`
  mutation FavoriteArticle($slug: String!) {
    favoriteArticle(slug: $slug) {
      ...FavoriteState
    }
  }
  ${FAVORITE_STATE_FRAGMENT}
`;

const UNFAVORITE_ARTICLE_MUTATION: TypedDocumentNode<
  UnfavoriteArticleMutation,
  UnfavoriteArticleMutationVariables
> = gql`
  mutation UnfavoriteArticle($slug: String!) {
    unfavoriteArticle(slug: $slug) {
      ...FavoriteState
    }
  }
  ${FAVORITE_STATE_FRAGMENT}
`;

/**
 * POST /article/:slug/favorite favorites, DELETE unfavorites. The optimistic
 * result updates the cache at once, and the routes do not load again.
 */
export async function clientAction({
  request,
  params,
  context,
}: Route.ClientActionArgs) {
  const client = context.get(apolloClientContext);
  const favorite = request.method === 'POST';
  if (!favorite && request.method !== 'DELETE') throw methodNotAllowed();

  const current = client.readFragment({
    id: client.cache.identify({ __typename: 'Article', slug: params.slug }),
    fragment: FAVORITE_STATE_FRAGMENT,
  });
  const optimistic = current && {
    ...current,
    favorited: favorite,
    favoritesCount:
      current.favoritesCount +
      (favorite === current.favorited ? 0 : favorite ? 1 : -1),
  };

  const { failure } = await attempt(async () => {
    if (favorite) {
      await client.mutate({
        mutation: FAVORITE_ARTICLE_MUTATION,
        variables: params,
        optimisticResponse: optimistic
          ? { favoriteArticle: optimistic }
          : undefined,
      });
      return;
    }
    await client.mutate({
      mutation: UNFAVORITE_ARTICLE_MUTATION,
      variables: params,
      optimisticResponse: optimistic
        ? { unfavoriteArticle: optimistic }
        : undefined,
    });
  });
  return failure ?? actionOk;
}
