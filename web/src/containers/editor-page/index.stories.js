import React from 'react';
import EditorPage, { EditorPageQuery } from '.';
import { withApolloClient } from 'storybook-addon-apollo-client';
import { withRouter } from '../../utils/storybook';
import { LayoutQuery } from '../layout';

export default {
  title: 'Pages/EditorPage',
  component: EditorPage,
  decorators: [withRouter, withApolloClient],
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
