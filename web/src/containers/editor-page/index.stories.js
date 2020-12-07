import React from 'react';
import EditorPage from '.';

export default {
  title: 'Pages/EditorPage',
  component: EditorPage,
};

export const renders = () => <EditorPage />;

renders.parameters = {
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
  nextRouter: {
    pathname: '/editor',
    asPath: '/editor',
  },
};

export const asUser = () => <EditorPage />;

asUser.parameters = {
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
  nextRouter: {
    pathname: '/editor',
    asPath: '/editor',
  },
};
