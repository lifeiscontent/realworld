import { describe, expect, it } from 'vitest';

import { hrefForPage, pageOf, totalPages } from './pagination';

describe('pageOf', () => {
  it('reads the page and computes the offset', () => {
    expect(pageOf(new URL('http://x/?page=3'))).toEqual({
      page: 3,
      limit: 10,
      offset: 20,
    });
  });

  it.each(['0', '-1', '1.5', 'abc', ''])('uses page 1 for %j', value => {
    expect(pageOf(new URL(`http://x/?page=${value}`)).page).toBe(1);
  });
});

describe('totalPages', () => {
  it('rounds up', () => {
    expect(totalPages(0)).toBe(0);
    expect(totalPages(10)).toBe(1);
    expect(totalPages(11)).toBe(2);
  });
});

describe('hrefForPage', () => {
  const location = { pathname: '/', search: '?feed=following&page=2' };

  it('keeps the other parameters', () => {
    expect(hrefForPage(location, 3)).toBe('/?feed=following&page=3');
  });

  it('removes the parameter for page 1', () => {
    expect(hrefForPage(location, 1)).toBe('/?feed=following');
    expect(hrefForPage({ pathname: '/tag/x', search: '?page=2' }, 1)).toBe(
      '/tag/x'
    );
  });
});
