import { withNextRouter } from 'storybook-addon-next-router';
import { MockedProvider } from '@apollo/client/testing';

export const decorators = [withNextRouter()];

export const parameters = {
  apolloClient: {
    MockedProvider,
  },
};
