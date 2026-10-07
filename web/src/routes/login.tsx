import { gql, type TypedDocumentNode } from '@apollo/client';
import { href, redirect } from 'react-router';
import { z } from 'zod';

import { apolloClientContext } from '../app/context';
import { authenticate, VIEWER_FRAGMENT } from '../app/viewer';
import { LoginForm } from '../features/auth/LoginForm';
import { actionErrors, errorsOf, parseForm } from '../lib/forms';
import { pageMeta } from '../lib/meta';
import type {
  LoginMutation,
  LoginMutationVariables,
} from '../types/__generated__/graphql';
import type { Route } from './+types/login';

export const LOGIN_MUTATION: TypedDocumentNode<
  LoginMutation,
  LoginMutationVariables
> = gql`
  mutation Login($user: LoginUser!) {
    login(user: $user) {
      token
      ...Viewer_user
    }
  }
  ${VIEWER_FRAGMENT}
`;

// The API validates the values.
const schema = z.object({ email: z.string(), password: z.string() });

/** POST /login signs in and opens the home page. */
export const meta: Route.MetaFunction = ({ error }) =>
  pageMeta('Sign in', error);

export async function clientAction({
  request,
  context,
}: Route.ClientActionArgs) {
  const { values, errors } = parseForm(schema, await request.formData());
  if (errors) return actionErrors(errors);

  const client = context.get(apolloClientContext);
  // The result has the token, so it does not go into the cache.
  const { failure } = await authenticate(client, async () => {
    const { data } = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: { user: values },
      fetchPolicy: 'no-cache',
    });
    return data?.login;
  });
  return failure ?? redirect(href('/'));
}

export default function Login({ actionData }: Route.ComponentProps) {
  return <LoginForm errors={errorsOf(actionData)} />;
}
