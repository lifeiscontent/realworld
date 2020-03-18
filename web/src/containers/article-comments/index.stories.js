import React from 'react';
import { ArticleComments, ArticleCommentsCreateCommentMutation } from '.';
import { withApolloClient, withRouter } from '../../utils/storybook';
import { InMemoryCache } from 'apollo-cache-inmemory';
import cacheConfig from '../../apollo/cache-config';

export default {
  title: 'Containers/ArticleComments',
  component: ArticleComments,
  decorators: [withApolloClient, withRouter]
};

export const canCreateComment = () => (
  <ArticleComments articleSlug="sunt-vitae-voluptatum-quas" />
);

canCreateComment.story = {
  parameters: {
    apolloClient: {
      cache: new InMemoryCache(cacheConfig).restore({
        'User:jamie': {
          username: 'jamie',
          __typename: 'User',
          profile: {
            type: 'id',
            generated: true,
            id: '$User:jamie.profile',
            typename: 'Profile'
          },
          canFollow: {
            type: 'id',
            generated: true,
            id: '$User:jamie.canFollow',
            typename: 'AuthorizationResult'
          },
          canUnfollow: {
            type: 'id',
            generated: true,
            id: '$User:jamie.canUnfollow',
            typename: 'AuthorizationResult'
          },
          followersCount: 0,
          viewerIsFollowing: false
        },
        ROOT_QUERY: {
          viewer: {
            type: 'id',
            generated: false,
            id: 'User:jamie',
            typename: 'User'
          },
          'articleBySlug({"slug":"sunt-vitae-voluptatum-quas"})': {
            type: 'id',
            generated: false,
            id: 'Article:sunt-vitae-voluptatum-quas',
            typename: 'Article'
          }
        },
        '$User:jamie.profile': {
          imageUrl: null,
          __typename: 'Profile'
        },
        '$User:jamie.canFollow': {
          value: false,
          __typename: 'AuthorizationResult'
        },
        '$User:jamie.canUnfollow': {
          value: false,
          __typename: 'AuthorizationResult'
        },
        'Article:sunt-vitae-voluptatum-quas': {
          author: {
            type: 'id',
            generated: false,
            id: 'User:jamie',
            typename: 'User'
          },
          canCreateComment: {
            type: 'id',
            generated: true,
            id: '$Article:sunt-vitae-voluptatum-quas.canCreateComment',
            typename: 'AuthorizationResult'
          },
          __typename: 'Article',
          comments: [
            {
              type: 'id',
              generated: false,
              id: 'Comment:1000',
              typename: 'Comment'
            },
            {
              type: 'id',
              generated: false,
              id: 'Comment:999',
              typename: 'Comment'
            },
            {
              type: 'id',
              generated: false,
              id: 'Comment:998',
              typename: 'Comment'
            },
            {
              type: 'id',
              generated: false,
              id: 'Comment:997',
              typename: 'Comment'
            },
            {
              type: 'id',
              generated: false,
              id: 'Comment:996',
              typename: 'Comment'
            }
          ],
          body:
            'Sit delectus in. Nesciunt saepe inventore. Quo quibusdam facere. Rem aliquam est. Est eveniet rerum. Porro enim consequatur. Sit culpa fuga. Accusamus dolores eaque. Id reiciendis totam. Quibusdam quod exercitationem.',
          description: 'Eos facere consequuntur id.',
          favoritesCount: 0,
          slug: 'sunt-vitae-voluptatum-quas',
          viewerDidFavorite: false,
          canDelete: {
            type: 'id',
            generated: true,
            id: '$Article:sunt-vitae-voluptatum-quas.canDelete',
            typename: 'AuthorizationResult'
          },
          canFavorite: {
            type: 'id',
            generated: true,
            id: '$Article:sunt-vitae-voluptatum-quas.canFavorite',
            typename: 'AuthorizationResult'
          },
          canUnfavorite: {
            type: 'id',
            generated: true,
            id: '$Article:sunt-vitae-voluptatum-quas.canUnfavorite',
            typename: 'AuthorizationResult'
          },
          createdAt: '2020-03-16T00:03:40Z',
          canUpdate: {
            type: 'id',
            generated: true,
            id: '$Article:sunt-vitae-voluptatum-quas.canUpdate',
            typename: 'AuthorizationResult'
          },
          title: 'Sunt vitae voluptatum quas.'
        },
        '$Article:sunt-vitae-voluptatum-quas.canCreateComment': {
          value: true,
          __typename: 'AuthorizationResult'
        },
        'User:ivy': {
          username: 'ivy',
          profile: {
            type: 'id',
            generated: true,
            id: '$User:ivy.profile',
            typename: 'Profile'
          },
          __typename: 'User'
        },
        '$User:ivy.profile': {
          imageUrl: null,
          __typename: 'Profile'
        },
        'Comment:1000': {
          author: {
            type: 'id',
            generated: false,
            id: 'User:ivy',
            typename: 'User'
          },
          body: 'Ratione sit hic nisi.',
          canDelete: {
            type: 'id',
            generated: true,
            id: '$Comment:1000.canDelete',
            typename: 'AuthorizationResult'
          },
          createdAt: '2020-03-16T00:03:40Z',
          id: '1000',
          __typename: 'Comment'
        },
        '$Comment:1000.canDelete': {
          value: true,
          __typename: 'AuthorizationResult'
        },
        'User:marcokozey': {
          username: 'marcokozey',
          profile: {
            type: 'id',
            generated: true,
            id: '$User:marcokozey.profile',
            typename: 'Profile'
          },
          __typename: 'User'
        },
        '$User:marcokozey.profile': {
          imageUrl: null,
          __typename: 'Profile'
        },
        'Comment:999': {
          author: {
            type: 'id',
            generated: false,
            id: 'User:marcokozey',
            typename: 'User'
          },
          body: 'Corporis nulla est voluptatem.',
          canDelete: {
            type: 'id',
            generated: true,
            id: '$Comment:999.canDelete',
            typename: 'AuthorizationResult'
          },
          createdAt: '2020-03-16T00:03:40Z',
          id: '999',
          __typename: 'Comment'
        },
        '$Comment:999.canDelete': {
          value: true,
          __typename: 'AuthorizationResult'
        },
        'User:ayakofadel': {
          username: 'ayakofadel',
          profile: {
            type: 'id',
            generated: true,
            id: '$User:ayakofadel.profile',
            typename: 'Profile'
          },
          __typename: 'User'
        },
        '$User:ayakofadel.profile': {
          imageUrl: null,
          __typename: 'Profile'
        },
        'Comment:998': {
          author: {
            type: 'id',
            generated: false,
            id: 'User:ayakofadel',
            typename: 'User'
          },
          body: 'Ipsa facere ad veritatis.',
          canDelete: {
            type: 'id',
            generated: true,
            id: '$Comment:998.canDelete',
            typename: 'AuthorizationResult'
          },
          createdAt: '2020-03-16T00:03:40Z',
          id: '998',
          __typename: 'Comment'
        },
        '$Comment:998.canDelete': {
          value: true,
          __typename: 'AuthorizationResult'
        },
        'User:trevajast': {
          username: 'trevajast',
          profile: {
            type: 'id',
            generated: true,
            id: '$User:trevajast.profile',
            typename: 'Profile'
          },
          __typename: 'User'
        },
        '$User:trevajast.profile': {
          imageUrl: null,
          __typename: 'Profile'
        },
        'Comment:997': {
          author: {
            type: 'id',
            generated: false,
            id: 'User:trevajast',
            typename: 'User'
          },
          body: 'Dolorem dicta cupiditate iure.',
          canDelete: {
            type: 'id',
            generated: true,
            id: '$Comment:997.canDelete',
            typename: 'AuthorizationResult'
          },
          createdAt: '2020-03-16T00:03:40Z',
          id: '997',
          __typename: 'Comment'
        },
        '$Comment:997.canDelete': {
          value: true,
          __typename: 'AuthorizationResult'
        },
        'User:gaylord': {
          username: 'gaylord',
          profile: {
            type: 'id',
            generated: true,
            id: '$User:gaylord.profile',
            typename: 'Profile'
          },
          __typename: 'User'
        },
        '$User:gaylord.profile': {
          imageUrl: null,
          __typename: 'Profile'
        },
        'Comment:996': {
          author: {
            type: 'id',
            generated: false,
            id: 'User:gaylord',
            typename: 'User'
          },
          body: 'Omnis consequatur debitis rerum.',
          canDelete: {
            type: 'id',
            generated: true,
            id: '$Comment:996.canDelete',
            typename: 'AuthorizationResult'
          },
          createdAt: '2020-03-16T00:03:40Z',
          id: '996',
          __typename: 'Comment'
        },
        '$Comment:996.canDelete': {
          value: true,
          __typename: 'AuthorizationResult'
        },
        '$Article:sunt-vitae-voluptatum-quas.canDelete': {
          value: true,
          __typename: 'AuthorizationResult'
        },
        '$Article:sunt-vitae-voluptatum-quas.canFavorite': {
          value: false,
          __typename: 'AuthorizationResult'
        },
        '$Article:sunt-vitae-voluptatum-quas.canUnfavorite': {
          value: false,
          __typename: 'AuthorizationResult'
        },
        '$Article:sunt-vitae-voluptatum-quas.canUpdate': {
          value: true,
          __typename: 'AuthorizationResult'
        }
      }),
      mocks: [
        {
          request: {
            query: ArticleCommentsCreateCommentMutation,
            variables: {
              articleSlug: 'sunt-vitae-voluptatum-quas',
              input: {
                body: 'Hello world'
              }
            }
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
                      __typename: 'Profile'
                    },
                    __typename: 'User'
                  },
                  body: 'Hello world',
                  createdAt: new Date(1994, 2, 1).toISOString(),
                  id: 'new',
                  canDelete: { value: true, __typename: 'AuthorizationResult' },
                  __typename: 'Comment'
                }
              }
            }
          }
        }
      ]
    },
    router: {
      pathname: '/article/[slug]',
      asPath: '/article/sunt-vitae-voluptatum-quas',
      query: {
        slug: 'sunt-vitae-voluptatum-quas'
      }
    }
  }
};
