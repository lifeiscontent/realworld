import { CombinedGraphQLErrors } from '@apollo/client';
import { describe, expect, it } from 'vitest';
import { errorMessages } from './errors';

function graphQLErrors(...errors: object[]) {
  return new CombinedGraphQLErrors({ errors: errors as never });
}

describe('errorMessages', () => {
  it('turns RealWorld validation errors into messages', () => {
    const error = graphQLErrors({
      message: 'Unprocessable entity',
      extensions: {
        code: 'UNPROCESSABLE_ENTITY',
        errors: { email: ["can't be blank"], base: ['is not allowed'] },
      },
    });
    expect(errorMessages(error)).toEqual([
      "email can't be blank",
      'is not allowed',
    ]);
  });

  it('uses the message of other GraphQL errors', () => {
    const error = graphQLErrors({
      message: 'You are not allowed to do this',
      extensions: { code: 'FORBIDDEN' },
    });
    expect(errorMessages(error)).toEqual(['You are not allowed to do this']);
  });

  it('ignores an errors object with the wrong shape', () => {
    const error = graphQLErrors({
      message: 'Unprocessable entity',
      extensions: { code: 'UNPROCESSABLE_ENTITY', errors: 'bad' },
    });
    expect(errorMessages(error)).toEqual(['Unprocessable entity']);
  });

  it('shows one message when the server cannot be reached', () => {
    expect(errorMessages(new TypeError('Failed to fetch'))).toEqual([
      'Unable to connect to the server. Try again.',
    ]);
  });
});
