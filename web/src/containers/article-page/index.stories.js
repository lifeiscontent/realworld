import ArticlePage from '.';

const meta = {
  component: ArticlePage,
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: ArticlePage.query,
            variables: {
              slug: 'sunt-vitae-voluptatum-quas',
            },
          },
          result: {
            data: {
              viewer: null,
              article: {
                author: {
                  username: 'jamie',
                  profile: {
                    imageUrl: null,
                    __typename: 'Profile',
                  },
                  __typename: 'User',
                  canFollow: {
                    value: false,
                    __typename: 'AuthorizationResult',
                  },
                  canUnfollow: {
                    value: false,
                    __typename: 'AuthorizationResult',
                  },
                  followersCount: 0,
                  viewerIsFollowing: false,
                },
                canCreateComment: {
                  value: false,
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
                      value: false,
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
                      value: false,
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
                      value: false,
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
                      value: false,
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
                      value: false,
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
                title: 'Sunt vitae voluptatum quas.',
                viewerDidFavorite: false,
                canDelete: {
                  value: false,
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
                  value: false,
                  __typename: 'AuthorizationResult',
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

export default meta;

export const AsGuest = {};

export const IsAuthor = {
  parameters: {
    ...meta.parameters,
    apolloClient: {
      mocks: [
        {
          request: {
            query: ArticlePage.query,
            variables: {
              slug: 'sunt-vitae-voluptatum-quas',
            },
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
                author: {
                  username: 'jamie',
                  profile: {
                    imageUrl: null,
                    __typename: 'Profile',
                  },
                  __typename: 'User',
                  canFollow: {
                    value: false,
                    __typename: 'AuthorizationResult',
                  },
                  canUnfollow: {
                    value: false,
                    __typename: 'AuthorizationResult',
                  },
                  followersCount: 0,
                  viewerIsFollowing: false,
                },
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
                title: 'Sunt vitae voluptatum quas.',
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
      ],
    },
  },
};
