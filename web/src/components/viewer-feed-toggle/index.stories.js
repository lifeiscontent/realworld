import { ViewerFeedToggle } from '.';

const meta = {
  component: ViewerFeedToggle,
};

export default meta;

export const AsGuest = {
  parameters: {
    nextRouter: {
      asPath: '/',
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
    nextRouter: {
      pathname: '/feed',
      asPath: '/feed',
    },
  },
};

export const HashTagActive = {
  args: {
    ...FeedEnabled.args,
  },
  parameters: {
    nextRouter: {
      pathname: '/',
      asPath: '/?tagName=react',
      query: { tagName: 'react' },
    },
  },
};
