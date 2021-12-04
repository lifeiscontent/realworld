import React from 'react';
import EditorPage from '.';

const meta = {
  title: 'Pages/EditorPage',
  component: EditorPage,
};

export default meta;

const Template = args => <EditorPage {...args} />;

export const Renders = Template.bind({});

Renders.parameters = {
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

export const AsUser = Template.bind({});

AsUser.parameters = {
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
