import React from 'react';
import EditorPage from '.';
import { withApolloClient } from 'storybook-addon-apollo-client';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'Pages/EditorPage',
  component: EditorPage,
  decorators: [withNextRouter, withApolloClient],
};

export const renders = () => <EditorPage />;

renders.story = {
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: EditorPage.query,
            variables: {},
          },
          result: {
            data: {
              canCreateArticle: {
                value: false,
                __typename: 'AuthorizationResult',
              },
              viewer: null,
            },
          },
        },
      ],
    },
    router: {
      pathname: '/editor',
      asPath: '/editor',
    },
  },
};

export const asUser = () => <EditorPage />;

asUser.story = {
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: EditorPage.query,
            variables: {},
          },
          result: {
            data: {
              canCreateArticle: {
                value: true,
                __typename: 'AuthorizationResult',
              },
              viewer: {
                username: 'jamie',
                __typename: 'User',
              },
            },
          },
        },
      ],
    },
    router: {
      pathname: '/editor',
      asPath: '/editor',
    },
  },
};
