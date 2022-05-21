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
    nextRouter: {
      pathname: '/user/[username]',
    },
  },
};

export const FavoritedArticlesActive = {
  parameters: {
    nextRouter: {
      pathname: '/user/[username]/favorites',
    },
  },
};
