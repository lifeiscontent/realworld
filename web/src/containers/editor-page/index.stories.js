import React from 'react';
import EditorPage, { EditorPageQuery } from '.';
import { withApolloClient } from 'storybook-addon-apollo-client';
import { withNextRouter } from 'storybook-addon-next-router';
import { LayoutQuery } from '../layout';

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
            query: LayoutQuery,
            variables: {},
          },
          result: {
            data: {
              viewer: null,
            },
          },
        },
        {
          request: {
            query: EditorPageQuery,
            variables: {},
          },
          result: {
            data: {
              canCreateArticle: {
                value: false,
                __typename: 'AuthorizationResult',
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

export const asUser = () => <EditorPage />;

asUser.story = {
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: LayoutQuery,
            variables: {},
          },
          result: {
            data: {
              viewer: {
                username: 'jamie',
                __typename: 'User',
              },
            },
          },
        },
        {
          request: {
            query: EditorPageQuery,
            variables: {},
          },
          result: {
            data: {
              canCreateArticle: {
                value: true,
                __typename: 'AuthorizationResult',
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
