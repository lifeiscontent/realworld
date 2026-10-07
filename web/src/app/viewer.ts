import type { ApolloClient } from '@apollo/client';
import { useReadQuery } from '@apollo/client/react';
import { useRouteLoaderData } from 'react-router';
import type {
  ViewerQuery,
  ViewerQueryVariables,
  Viewer_UserFragment,
} from '../types/__generated__/graphql';
import {
  apolloClientContext,
  preloadQueryContext,
  type AppContext,
} from './context';
import { actionErrors, attempt } from '../lib/forms';
import { clearToken, getToken, setToken } from './session';
import { gql, type TypedDocumentNode } from '@apollo/client';

export const VIEWER_FRAGMENT: TypedDocumentNode<Viewer_UserFragment> = gql`
  fragment Viewer_user on User {
    email
    username
    bio
    image
  }
`;

/**
 * GET /api/user. Its cache entry is the session: login writes the user into
 * it, and logout writes null. The rest of the app reads the viewer from it.
 */
export const VIEWER_QUERY: TypedDocumentNode<
  ViewerQuery,
  ViewerQueryVariables
> = gql`
  query Viewer {
    user {
      ...Viewer_user
    }
  }
  ${VIEWER_FRAGMENT}
`;

function writeViewer(client: ApolloClient, user: Viewer_UserFragment | null) {
  client.writeQuery({
    query: VIEWER_QUERY,
    data: { user },
  });
}

/**
 * Loads the viewer for the root route. Without a token there is no request.
 * A token that the API does not accept is removed.
 */
export async function loadViewer(context: AppContext) {
  const client = context.get(apolloClientContext);
  const preloadQuery = context.get(preloadQueryContext);

  if (!getToken()) {
    writeViewer(client, null);
    // The cache has the null viewer, so this makes no request.
    return preloadQuery(VIEWER_QUERY);
  }

  const viewerRef = await preloadQuery.toPromise(
    preloadQuery(VIEWER_QUERY, { errorPolicy: 'all' })
  );
  const cached = client.readQuery({ query: VIEWER_QUERY });
  if (cached && !cached.user) clearToken();
  return viewerRef;
}

/**
 * Starts a session after login or register: it clears the data of the guest,
 * caches the user without the token, and stores the token.
 */
export async function startSession(
  client: ApolloClient,
  { token, ...user }: SignedInUser
) {
  await client.clearStore();
  writeViewer(client, user);
  setToken(token);
}

/** A user with the token, as login, register, and updateUser return it. */
type SignedInUser = Viewer_UserFragment & { token: string };

/**
 * Runs a mutation that returns the user with a token, then starts the
 * session. It returns the user, or the failure of the action.
 */
export async function authenticate(
  client: ApolloClient,
  mutation: () => Promise<SignedInUser | undefined>
) {
  const { result: user, failure } = await attempt(mutation);
  if (failure) return { user: null, failure };
  if (!user) {
    return {
      user: null,
      failure: actionErrors(['The server did not return the user.']),
    };
  }
  await startSession(client, user);
  return { user, failure: null };
}

/** Ends the session and removes all data of the user. */
export async function endSession(client: ApolloClient) {
  clearToken();
  await client.clearStore();
  writeViewer(client, null);
}

export type AuthState = 'authenticated' | 'unauthenticated' | 'unavailable';

/** The data of the root loader. */
export interface RootLoaderData {
  viewerRef: Awaited<ReturnType<typeof loadViewer>>;
}

/** The viewer in a component, from the root loader. It updates with the cache. */
export function useViewer() {
  const root = useRouteLoaderData<RootLoaderData>('root');
  if (!root) throw new Error('useViewer needs the root route.');
  const { data, dataState, error } = useReadQuery(root.viewerRef);
  const viewer = dataState === 'complete' ? data.user : null;
  const authState: AuthState = viewer
    ? 'authenticated'
    : error && getToken()
      ? 'unavailable'
      : 'unauthenticated';
  return { viewer, authState };
}
