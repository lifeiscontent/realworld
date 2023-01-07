import { UserArticlesToggle } from '.';

const meta = {
  component: UserArticlesToggle,
  args: {
    username: 'lifeiscontent',
  },
};

export default meta;

export const AsGuest = {};

export const MyArticlesActive = {
  parameters: {
    nextjs: {
      router: {
        asPath: '/user/lifeiscontent',
      },
    },
  },
};

export const FavoritedArticlesActive = {
  parameters: {
    nextjs: {
      router: {
        asPath: '/user/lifeiscontent/favorites',
      },
    },
  },
};
