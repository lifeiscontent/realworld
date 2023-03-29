import { ViewerFeedToggle } from '.';

const meta = {
  component: ViewerFeedToggle,
};

export default meta;

export const AsGuest = {
  parameters: {
    nextjs: {
      router: {
        asPath: '/',
      },
    },
  },
};

export const FeedEnabled = {
  args: {
    username: 'lifeiscontent',
  },
};

export const FeedActive = {
  args: {
    ...FeedEnabled.args,
  },
  parameters: {
    nextjs: {
      router: {
        asPath: '/feed',
      },
    },
  },
};

export const HashTagActive = {
  args: {
    ...FeedEnabled.args,
  },
  parameters: {
    nextjs: {
      router: {
        asPath: '/?tagName=react',
        query: { tagName: 'react' },
      },
    },
  },
};
