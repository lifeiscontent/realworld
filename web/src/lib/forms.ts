import { data } from 'react-router';
import type { z } from 'zod';

import { errorMessages } from './errors';

/** The data that an action gives to its form. */
export type ActionResult = { ok: true } | { ok: false; errors: string[] };

export const actionOk: ActionResult = { ok: true };

/** The result of an action that failed, with the messages for the form. */
export function actionErrors(errors: string[], status = 422) {
  return data<ActionResult>({ ok: false, errors }, { status });
}

/** The messages of an action result, if it failed. */
export function errorsOf(result: ActionResult | undefined) {
  return result && !result.ok ? result.errors : undefined;
}

/**
 * Reads a form with a Zod schema. The fields in `arrays` can have more than
 * one value, for example the tags of an article.
 */
export function parseForm<S extends z.ZodType>(
  schema: S,
  formData: FormData,
  { arrays = [] }: { arrays?: ReadonlyArray<string> } = {}
) {
  const entries: Record<string, unknown> = {};
  for (const key of new Set(formData.keys())) {
    entries[key] = arrays.includes(key)
      ? formData.getAll(key)
      : formData.get(key);
  }
  const result = schema.safeParse(entries);
  return result.success
    ? { values: result.data, errors: null }
    : { values: null, errors: result.error.issues.map(issue => issue.message) };
}

/** Runs a mutation. A failure becomes the 422 result of the action. */
export async function attempt<T>(mutation: () => Promise<T>) {
  try {
    return { result: await mutation(), failure: null };
  } catch (error) {
    return { result: null, failure: actionErrors(errorMessages(error)) };
  }
}
