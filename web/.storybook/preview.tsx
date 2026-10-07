import { ApolloClient } from '@apollo/client';
import { useApolloClient } from '@apollo/client/react';
import { MockLink } from '@apollo/client/testing';
import type { RouteConfigEntry } from '@react-router/dev/routes';
import addonA11y from '@storybook/addon-a11y';
import addonDocs from '@storybook/addon-docs';
import { type Decorator, definePreview } from '@storybook/react-vite';
import { useState, type ComponentType } from 'react';
import {
  createRoutesStub,
  type ClientActionFunction,
  type ClientLoaderFunction,
  type MiddlewareFunction,
  type ShouldRevalidateFunction,
} from 'react-router';
import apolloClient from 'storybook-addon-apollo-client';

import { createCache } from '../src/app/apollo';
import { routerContextFor } from '../src/app/context';
import routeConfig from '../src/routes';

import '../src/app.css';

/** The exports of a route module that a story router uses. */
interface RouteModule {
  default?: ComponentType;
  ErrorBoundary?: ComponentType;
  HydrateFallback?: ComponentType;
  clientLoader?: ClientLoaderFunction;
  clientAction?: ClientActionFunction;
  clientMiddleware?: MiddlewareFunction[];
  shouldRevalidate?: ShouldRevalidateFunction;
}

const modules = import.meta.glob<RouteModule>(
  [
    '../src/root.tsx',
    '../src/routes/*.{ts,tsx}',
    '!../src/routes/*.stories.tsx',
  ],
  { eager: true }
);

type StubRoute = Parameters<typeof createRoutesStub>[0][number];

/**
 * Makes a story route from an entry of src/routes.ts, like the React Router
 * plugin makes it for the app. In SPA mode the routes have client exports.
 */
function toStubRoute(entry: RouteConfigEntry): StubRoute {
  const route = modules[`../src/${entry.file}`];
  if (!route) throw new Error(`No route module for ${entry.file}`);
  return {
    id: entry.id ?? entry.file.replace(/\.tsx?$/, ''),
    path: entry.path,
    index: entry.index,
    Component: route.default,
    ErrorBoundary: route.ErrorBoundary,
    HydrateFallback: route.HydrateFallback,
    loader: route.clientLoader,
    action: route.clientAction,
    middleware: route.clientMiddleware,
    shouldRevalidate: route.shouldRevalidate,
    children: entry.children?.map(toStubRoute),
  } as StubRoute;
}

/** The routes of the app, below the root route like in src/root.tsx. */
const appRoutes = [
  toStubRoute({
    id: 'root',
    path: '/',
    file: 'root.tsx',
    children: routeConfig,
  }),
];

interface RouterParameters {
  /** Renders the routes of the app instead of only the story. */
  app?: boolean;
  /** The URL to open, for example "/article/how-to-train-your-dragon". */
  url?: string;
}

/**
 * Renders the story in a test router. The loaders, actions, and middleware
 * get the mocked client of the story from the router context, like in the
 * app.
 */
const withRouter: Decorator = (Story, { parameters }) => {
  const client = useApolloClient();
  const { app = false, url = '/' }: RouterParameters = parameters.router ?? {};
  // Storybook mounts the decorator again for each story, so one stub is
  // enough.
  const [RoutesStub] = useState(() =>
    createRoutesStub(
      app ? appRoutes : [{ id: 'story', path: '*', Component: Story }],
      routerContextFor(client)()
    )
  );
  return <RoutesStub initialEntries={[url]} />;
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
