import { ArticleComments, ArticleCommentsCreateCommentMutation } from '.';

const meta = {
  component: ArticleComments,
};

export default meta;

export const CanCreateComment = {
  args: {
    articleSlug: 'sunt-vitae-voluptatum-quas',
  },
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: ArticleComments.query,
            variables: { slug: 'sunt-vitae-voluptatum-quas' },
          },
          result: {
            data: {
              viewer: {
                username: 'jamie',
                profile: {
                  imageUrl: null,
                  __typename: 'Profile',
                },
                __typename: 'User',
              },
              article: {
                canCreateComment: {
                  value: true,
                  __typename: 'AuthorizationResult',
                },
                __typename: 'Article',
                comments: [
                  {
                    author: {
                      username: 'ivy',
                      profile: {
                        imageUrl: null,
                        __typename: 'Profile',
                      },
                      __typename: 'User',
                    },
                    body: 'Ratione sit hic nisi.',
                    canDelete: {
                      value: true,
                      __typename: 'AuthorizationResult',
                    },
                    createdAt: '2020-03-16T00:03:40Z',
                    id: '1000',
                    __typename: 'Comment',
                  },
                  {
                    author: {
                      username: 'marcokozey',
                      profile: {
                        imageUrl: null,
                        __typename: 'Profile',
                      },
                      __typename: 'User',
                    },
                    body: 'Corporis nulla est voluptatem.',
                    canDelete: {
                      value: true,
                      __typename: 'AuthorizationResult',
                    },
                    createdAt: '2020-03-16T00:03:40Z',
                    id: '999',
                    __typename: 'Comment',
                  },
                  {
                    author: {
                      username: 'ayakofadel',
                      profile: {
                        imageUrl: null,
                        __typename: 'Profile',
                      },
                      __typename: 'User',
                    },
                    body: 'Ipsa facere ad veritatis.',
                    canDelete: {
                      value: true,
                      __typename: 'AuthorizationResult',
                    },
                    createdAt: '2020-03-16T00:03:40Z',
                    id: '998',
                    __typename: 'Comment',
                  },
                  {
                    author: {
                      username: 'trevajast',
                      profile: {
                        imageUrl: null,
                        __typename: 'Profile',
                      },
                      __typename: 'User',
                    },
                    body: 'Dolorem dicta cupiditate iure.',
                    canDelete: {
                      value: true,
                      __typename: 'AuthorizationResult',
                    },
                    createdAt: '2020-03-16T00:03:40Z',
                    id: '997',
                    __typename: 'Comment',
                  },
                  {
                    author: {
                      username: 'gaylord',
                      profile: {
                        imageUrl: null,
                        __typename: 'Profile',
                      },
                      __typename: 'User',
                    },
                    body: 'Omnis consequatur debitis rerum.',
                    canDelete: {
                      value: true,
                      __typename: 'AuthorizationResult',
                    },
                    createdAt: '2020-03-16T00:03:40Z',
                    id: '996',
                    __typename: 'Comment',
                  },
                ],
                body: 'Sit delectus in. Nesciunt saepe inventore. Quo quibusdam facere. Rem aliquam est. Est eveniet rerum. Porro enim consequatur. Sit culpa fuga. Accusamus dolores eaque. Id reiciendis totam. Quibusdam quod exercitationem.',
                description: 'Eos facere consequuntur id.',
                favoritesCount: 0,
                slug: 'sunt-vitae-voluptatum-quas',
                viewerDidFavorite: false,
                canDelete: {
                  value: true,
                  __typename: 'AuthorizationResult',
                },
                canFavorite: {
                  value: false,
                  __typename: 'AuthorizationResult',
                },
                canUnfavorite: {
                  value: false,
                  __typename: 'AuthorizationResult',
                },
                createdAt: '2020-03-16T00:03:40Z',
                canUpdate: {
                  value: true,
                  __typename: 'AuthorizationResult',
                },
              },
            },
          },
        },
        {
          request: {
            query: ArticleCommentsCreateCommentMutation,
            variables: {
              articleSlug: 'sunt-vitae-voluptatum-quas',
              input: {
                body: 'Hello world',
              },
            },
          },
          result: {
            data: {
              createComment: {
                __typename: 'CreateCommentPayload',
                comment: {
                  author: {
                    username: 'jamie',
                    profile: {
                      imageUrl: null,
                      __typename: 'Profile',
                    },
                    __typename: 'User',
                  },
                  body: 'Hello world!',
                  createdAt: new Date(1994, 2, 1).toISOString(),
                  id: 'new',
                  canDelete: { value: true, __typename: 'AuthorizationResult' },
                  __typename: 'Comment',
                },
              },
            },
          },
        },
      ],
    },
    nextjs: {
      router: {
        asPath: '/article/sunt-vitae-voluptatum-quas',
        query: {
          slug: 'sunt-vitae-voluptatum-quas',
        },
      },
    },
  },
};
