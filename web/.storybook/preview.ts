import { ApolloClient } from '@apollo/client';
import { MockLink, type MockedResponse } from '@apollo/client/testing';
import { definePreview } from '@storybook/nextjs';
import apolloClient from 'storybook-addon-apollo-client';
import { createCache } from '../src/lib/apolloClient';

export default definePreview({
  addons: [
    apolloClient({
      createClient: ({ mocks = [] }: { mocks?: ReadonlyArray<MockedResponse> }) =>
        new ApolloClient({ cache: createCache(), link: new MockLink(mocks) }),
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
});
