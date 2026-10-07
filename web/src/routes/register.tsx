import { gql, type TypedDocumentNode } from '@apollo/client';
import { href, redirect } from 'react-router';
import { z } from 'zod';

import { apolloClientContext } from '../app/context';
import { authenticate, VIEWER_FRAGMENT } from '../app/viewer';
import { RegisterForm } from '../features/auth/RegisterForm';
import { actionErrors, errorsOf, parseForm } from '../lib/forms';
import { pageMeta } from '../lib/meta';
import type {
  RegisterMutation,
  RegisterMutationVariables,
} from '../types/__generated__/graphql';
import type { Route } from './+types/register';

const REGISTER_MUTATION: TypedDocumentNode<
  RegisterMutation,
  RegisterMutationVariables
> = gql`
  mutation Register($user: NewUser!) {
    register(user: $user) {
      token
      ...Viewer_user
    }
  }
  ${VIEWER_FRAGMENT}
`;

// The API validates the values.
const schema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

/** POST /register makes an account, signs in, and opens the home page. */
export const meta: Route.MetaFunction = ({ error }) =>
  pageMeta('Sign up', error);

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
      mutation: REGISTER_MUTATION,
      variables: { user: values },
      fetchPolicy: 'no-cache',
    });
    return data?.register;
  });
  return failure ?? redirect(href('/'));
}

export default function Register({ actionData }: Route.ComponentProps) {
  return <RegisterForm errors={errorsOf(actionData)} />;
}
