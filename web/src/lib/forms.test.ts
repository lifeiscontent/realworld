import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { errorsOf, parseForm } from './forms';

function formData(entries: [string, string][]) {
  const data = new FormData();
  for (const [key, value] of entries) data.append(key, value);
  return data;
}

describe('parseForm', () => {
  const schema = z.object({
    title: z.string().trim().min(1, "title can't be blank"),
    tagList: z.array(z.string()).default([]),
  });

  it('reads array fields with all their values', () => {
    const { values } = parseForm(
      schema,
      formData([
        ['title', ' Dragons '],
        ['tagList', 'a'],
        ['tagList', 'b'],
      ]),
      { arrays: ['tagList'] }
    );
    expect(values).toEqual({ title: 'Dragons', tagList: ['a', 'b'] });
  });

  it('reads other fields as one value', () => {
    const { values } = parseForm(
      z.object({ title: z.string() }),
      formData([
        ['title', 'first'],
        ['title', 'second'],
      ])
    );
    expect(values).toEqual({ title: 'first' });
  });

  it('returns the messages of the schema', () => {
    const { values, errors } = parseForm(schema, formData([['title', ' ']]));
    expect(values).toBeNull();
    expect(errors).toEqual(["title can't be blank"]);
  });
});

describe('errorsOf', () => {
  it('returns the messages of a failed result only', () => {
    expect(errorsOf({ ok: false, errors: ['x'] })).toEqual(['x']);
    expect(errorsOf({ ok: true })).toBeUndefined();
    expect(errorsOf(undefined)).toBeUndefined();
  });
});
