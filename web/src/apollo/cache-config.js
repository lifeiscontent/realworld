import { defaultDataIdFromObject } from '@apollo/client';

const cacheConfig = {
  freezeResults: true,
  resultCaching: true,
  dataIdFromObject(object) {
    switch (object.__typename) {
      case 'Article':
        return `${object.__typename}:${object.slug}`;
      case 'User':
        return `${object.__typename}:${object.username}`;
      default:
        return defaultDataIdFromObject(object);
    }
  },
  cacheRedirects: {
    Query: {
      articleBySlug(_root, args, context) {
        return context.getCacheKey({
          __typename: 'Article',
          slug: args.slug,
        });
      },
      comment(_root, args, context) {
        return context.getCacheKey({
          __typename: 'Comment',
          id: args.id,
        });
      },
      userByUsername(_root, args, context) {
        return context.getCacheKey({
          __typename: 'User',
          username: args.username,
        });
      },
      tag(_root, args, context) {
        return context.getCacheKey({
          __typename: 'Tag',
          id: args.id,
        });
      },
    },
  },
};

export default cacheConfig;
