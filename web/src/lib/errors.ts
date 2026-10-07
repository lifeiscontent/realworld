import { CombinedGraphQLErrors, ServerError } from '@apollo/client';
import { z } from 'zod';

// The RealWorld errors object: { field: [messages] }.
const fieldErrors = z.record(z.string(), z.array(z.string()));

/**
 * Returns the messages to show for a failed request. Validation errors have
 * the RealWorld errors object in extensions.errors.
 */
export function errorMessages(error: unknown): string[] {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors.flatMap(graphQLError => {
      const errors = fieldErrors.safeParse(graphQLError.extensions?.errors);
      if (
        graphQLError.extensions?.code !== 'UNPROCESSABLE_ENTITY' ||
        !errors.success
      ) {
        return [graphQLError.message];
      }
      return Object.entries(errors.data).flatMap(([field, messages]) =>
        messages.map(message =>
          field === 'base' ? message : `${field} ${message}`
        )
      );
    });
  }

  // fetch rejects with a TypeError when the server cannot be reached.
  if (ServerError.is(error) || error instanceof TypeError) {
    return ['Unable to connect to the server. Try again.'];
  }

  return [error instanceof Error ? error.message : String(error)];
}
