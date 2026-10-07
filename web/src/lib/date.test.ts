import { describe, expect, it } from 'vitest';

import { formatDate } from './date';

// Noon UTC is the same day in every time zone from UTC-11 to UTC+11.
describe('formatDate', () => {
  it.each([
    ['2026-01-01T12:00:00Z', 'January 1st'],
    ['2026-01-02T12:00:00Z', 'January 2nd'],
    ['2026-01-03T12:00:00Z', 'January 3rd'],
    ['2026-01-04T12:00:00Z', 'January 4th'],
    ['2026-01-11T12:00:00Z', 'January 11th'],
    ['2026-01-12T12:00:00Z', 'January 12th'],
    ['2026-01-13T12:00:00Z', 'January 13th'],
    ['2026-01-21T12:00:00Z', 'January 21st'],
    ['2026-01-22T12:00:00Z', 'January 22nd'],
  ])('formats %s as %s', (value, expected) => {
    expect(formatDate(value)).toBe(expected);
  });
});
