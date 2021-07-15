import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { MockedProvider } from '@apollo/client/testing';

export const parameters = {
  nextRouter: {
    Provider: RouterContext.Provider,
  },
  apolloClient: {
    MockedProvider,
  },
};
