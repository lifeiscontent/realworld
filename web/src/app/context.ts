import type { ApolloClient } from '@apollo/client';
import {
  createQueryPreloader,
  type PreloadQueryFunction,
} from '@apollo/client/react';
import { createContext, RouterContextProvider } from 'react-router';

/**
 * Loaders and actions get Apollo from the router context, so route modules
 * have no module state and stories can give them a mocked client.
 */
export const apolloClientContext = createContext<ApolloClient>();
export const preloadQueryContext = createContext<PreloadQueryFunction>();

/** Makes the getContext function of a router for this client. */
export function routerContextFor(client: ApolloClient) {
  const preloadQuery = createQueryPreloader(client);
  return () => {
    const context = new RouterContextProvider();
    context.set(apolloClientContext, client);
    context.set(preloadQueryContext, preloadQuery);
    return context;
  };
}

export type AppContext = Readonly<RouterContextProvider>;
