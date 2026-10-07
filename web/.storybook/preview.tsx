import { ApolloClient } from '@apollo/client';
import { useApolloClient } from '@apollo/client/react';
import { MockLink } from '@apollo/client/testing';
import addonA11y from '@storybook/addon-a11y';
import addonDocs from '@storybook/addon-docs';
import { definePreview, type Decorator } from '@storybook/react-vite';
import { useState } from 'react';
import { createMemoryRouter, type RouteObject } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import apolloClient from 'storybook-addon-apollo-client';
import { createCache } from '../src/app/apollo';
import { routerContextFor } from '../src/app/context';
import '../src/app.css';

interface RouterParameters {
  /** The routes of the story. Without routes, the story is the only route. */
  routes?: RouteObject[];
  /** The URL to open, for example "/article/how-to-train-your-dragon". */
  url?: string;
}

/**
 * Renders the story in a memory router. The loaders and actions get the
 * mocked client of the story from the router context, like in the app.
 */
const withRouter: Decorator = (Story, { parameters }) => {
  const client = useApolloClient();
  const { routes, url = '/' }: RouterParameters = parameters.router ?? {};
  // Storybook mounts the decorator again for each story, so one router is
  // enough.
  const [router] = useState(() =>
    createMemoryRouter(routes ?? [{ path: '*', Component: Story }], {
      initialEntries: [url],
      getContext: routerContextFor(client),
    })
  );
  return <RouterProvider router={router} />;
};

export default definePreview({
  addons: [
    addonDocs(),
    addonA11y(),
    apolloClient({
      createClient: ({
        mocks = [],
      }: {
        mocks?: ReadonlyArray<MockLink.MockedResponse>;
      }) =>
        new ApolloClient({ cache: createCache(), link: new MockLink(mocks) }),
    }),
  ],
  decorators: [withRouter],
  parameters: {
    layout: 'fullscreen',
    // Each story gets a client. Stories that load data add their mocks.
    apolloClient: { mocks: [] },
    // Accessibility violations fail the story tests. The colors come from
    // the shared Conduit theme of the RealWorld spec (public/styles.css), so
    // this app cannot fix its contrast.
    a11y: {
      test: 'error',
      config: { rules: [{ id: 'color-contrast', enabled: false }] },
    },
  },
});
