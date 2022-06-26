import { ArticlePreview } from '.';
import { buildAuthorizationResult } from '../../utils/storybook';

const meta = {
  component: ArticlePreview,
  args: {
    author: {
      username: 'lifeiscontent',
      profile: {},
    },
    createdAt: new Date(2000, 2, 1).toISOString(),
    description: 'web stuff',
    favoritesCount: 0,
    slug: 'some-cool-title',
    viewerDidFavorite: false,
  },
  argTypes: {
    onFavorite: { action: true },
    onUnfavorite: { action: true },
  },
};

export default meta;

export const AsGuest = {};

export const HasTags = {
  args: {
    tags: [{ id: '1', name: 'programming' }],
  },
};

export const CanFavorite = {
  args: {
    canFavorite: buildAuthorizationResult({ value: true }),
    viewerDidFavorite: true,
  },
};

export const CanUnfavorite = {
  args: {
    canUnfavorite: buildAuthorizationResult({ value: true }),
    favoritesCount: 1,
  },
};

export const WithProfileImage = {
  args: {
    author: {
      profile: {
        imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
    },
    viewerDidFavorite: true,
  },
};
