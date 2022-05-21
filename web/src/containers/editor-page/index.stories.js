import EditorPage from '.';

const meta = {
  component: EditorPage,
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
  },
};

export default meta;

export const AsGuest = {};

export const AsUser = {
  parameters: {
    ...meta.parameters,
    apolloClient: {
      mocks: [
        {
          request: {
            query: EditorPage.query,
            variables: {},
          },
          result: {
            data: {
              viewer: {
                canCreateArticle: {
                  value: true,
                  __typename: 'AuthorizationResult',
                },
                username: 'jamie',
                __typename: 'User',
              },
            },
          },
        },
      ],
    },
  },
};
