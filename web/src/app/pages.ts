import type { PathParam } from 'react-router';

/**
 * The paths of the routes in src/app/router.tsx. React Router's typegen
 * registers them in framework mode. This app uses data mode, so this list
 * registers them, and href() checks the path and its params. A unit test
 * checks that the router has the same paths.
 */
export const PAGES = [
  '/',
  '/tag/:tag',
  '/article/:slug',
  '/article/:slug/favorite',
  '/article/:slug/comments',
  '/article/:slug/comments/:id',
  '/profile/:username/:tab?',
  '/profile/:username/follow',
  '/editor/:slug?',
  '/login',
  '/register',
  '/settings',
  '/logout',
] as const;

type Page = (typeof PAGES)[number];

/** A param is optional when its segment ends with "?", like ":tab?". */
type IsOptional<
  P extends string,
  K extends string,
> = P extends `${string}:${K}?${string}` ? true : false;

type ParamsOf<P extends string> = {
  [K in PathParam<P> as IsOptional<P, K> extends true ? never : K]: string;
} & {
  [K in PathParam<P> as IsOptional<P, K> extends true ? K : never]?: string;
};

declare module 'react-router' {
  interface Register {
    pages: { [P in Page]: { params: ParamsOf<P> } };
  }
}
