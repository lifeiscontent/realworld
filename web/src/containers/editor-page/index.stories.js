import EditorPage from '.';

const meta = {
  component: EditorPage,
};

export default meta;

export const AsGuest = {
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: EditorPage.query,
          },
          result: {
            data: {
              viewer: null,
            },
          },
        },
      ],
    },
    nextjs: {
      router: {
        asPath: '/editor',
        path: '/editor',
      },
    },
  },
  async play() {
    // TODO: Implement play test
    // await waitFor(() =>
    //   expect(parameters.nextjs.router.replace).toHaveBeenCalledWith(
    //     '/editor',
    //     '/',
    //     { shallow: true }
    //   )
    // );
  },
};

export const AsUser = {
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: EditorPage.query,
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
    nextjs: {
      router: {
        asPath: '/editor',
        path: '/editor',
      },
    },
  },
  async play() {
    // TODO: Implement play test
    // await waitFor(() =>
    //   expect(parameters.nextjs.router.replace).not.toHaveBeenCalled()
    // );
  },
};
