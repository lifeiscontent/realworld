import Router from 'next/dist/client/router';
export { RouterContext } from 'next/dist/next-server/lib/router-context';

if (typeof window.scrollTo !== 'function') {
  window.scrollTo = jest.fn();
}

Router.router = {
  asPath: '/',
  back: jest.fn(),
  beforePopState: jest.fn(),
  pageLoader: { prefetched: {} },
  pathname: '/',
  prefetch: jest.fn(),
  push: jest.fn().mockResolvedValue(false),
  query: {},
  reload: jest.fn(),
  replace: jest.fn().mockResolvedValue(false)
};

export default Router;
