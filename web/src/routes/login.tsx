import { redirect, useActionData, type ActionFunctionArgs } from 'react-router';
import { z } from 'zod';
import { apolloClientContext } from '../app/context';
import { authenticate } from '../app/viewer';
import { LoginForm } from '../components/LoginForm';
import { actionErrors, errorsOf, parseForm } from '../lib/forms';
import { paths } from '../lib/paths';
import { gql, type TypedDocumentNode } from '@apollo/client';
import { VIEWER_FRAGMENT } from '../app/viewer';
import type {
  LoginMutation,
  LoginMutationVariables,
} from '../types/__generated__/graphql';

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
export async function action({ request, context }: ActionFunctionArgs) {
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
  return failure ?? redirect(paths.home());
}

export function Component() {
  const result = useActionData<typeof action>();
  return (
    <>
      <title>Sign in | Conduit</title>
      <LoginForm errors={errorsOf(result)} />
    </>
  );
}
