import { href, type RouteObject } from 'react-router';
import { describe, expect, it } from 'vitest';

import { PAGES } from './pages';
import { routes } from './router';

/** The absolute paths of all routes, except the catch-all route. */
function pathsOf(routeObjects: RouteObject[], parent = ''): string[] {
  return routeObjects.flatMap(route => {
    const path = route.index ? parent : (route.path ?? parent);
    const own = route.path || route.index ? [path] : [];
    return [...own, ...pathsOf(route.children ?? [], path)];
  });
}

describe('PAGES', () => {
  it('has the same paths as the router', () => {
    const routerPaths = new Set(pathsOf(routes).filter(path => path !== '*'));
    expect(new Set(PAGES)).toEqual(routerPaths);
  });
});

describe('href', () => {
  it('encodes the params', () => {
    expect(href('/profile/:username/:tab?', { username: 'a b/c' })).toBe(
      '/profile/a%20b%2Fc'
    );
    expect(href('/tag/:tag', { tag: 'c#' })).toBe('/tag/c%23');
  });

  it('leaves out an optional param without a value', () => {
    expect(href('/editor/:slug?')).toBe('/editor');
    expect(href('/editor/:slug?', { slug: 'dragons' })).toBe('/editor/dragons');
    expect(
      href('/profile/:username/:tab?', { username: 'jake', tab: 'favorites' })
    ).toBe('/profile/jake/favorites');
  });
});
