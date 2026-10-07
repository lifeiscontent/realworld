import { ApolloProvider } from '@apollo/client/react';
import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

import { createApolloClient } from './app/apollo';
import { routerContextFor } from './app/context';

const client = createApolloClient();

// Each navigation gets a router context with the Apollo client, so loaders,
// actions, and middleware reach Apollo only through the context.
//
// The loaders wait for their data, so a new page is ready when the router
// changes the URL. Without transitions, the page shows in the same render
// as the URL. With them, React can show the old page under the new URL.
startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ApolloProvider client={client}>
        <HydratedRouter
          getContext={routerContextFor(client)}
          useTransitions={false}
        />
      </ApolloProvider>
    </StrictMode>
  );
});
