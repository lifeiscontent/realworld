import { describe, expect, it } from 'vitest';
import { paths } from './paths';

describe('paths', () => {
  it('encodes the parameters', () => {
    expect(paths.profile('a b/c')).toBe('/profile/a%20b%2Fc');
    expect(paths.tag('c#')).toBe('/tag/c%23');
    expect(paths.articleComment('x?y', '1')).toBe('/article/x%3Fy/comments/1');
  });

  it('builds the editor path with and without a slug', () => {
    expect(paths.editor()).toBe('/editor');
    expect(paths.editor('dragons')).toBe('/editor/dragons');
  });
});
