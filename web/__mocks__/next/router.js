import Router from 'next/dist/client/router';

const push = jest.fn().mockResolvedValue(false);
const replace = jest.fn().mockResolvedValue(false);

Router.push = push;
Router.replace = replace;

Router.router = {
  push,
  replace
};

export function useRouter() {
  return Router.router;
}

export default Router;
