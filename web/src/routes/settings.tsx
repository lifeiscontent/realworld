import { redirect, useActionData, type ActionFunctionArgs } from 'react-router';
import { z } from 'zod';
import { apolloClientContext } from '../app/context';
import { authenticate, useViewer } from '../app/viewer';
import { SettingsForm } from '../components/SettingsForm';
import { actionErrors, errorsOf, parseForm } from '../lib/forms';
import { paths } from '../lib/paths';
import { gql, type TypedDocumentNode } from '@apollo/client';
import { VIEWER_FRAGMENT } from '../app/viewer';
import type {
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from '../types/__generated__/graphql';

const UPDATE_USER_MUTATION: TypedDocumentNode<
  UpdateUserMutation,
  UpdateUserMutationVariables
> = gql`
  mutation UpdateUser($user: UpdateUser!) {
    updateUser(user: $user) {
      token
      ...Viewer_user
    }
  }
  ${VIEWER_FRAGMENT}
`;

// The API validates the values. An empty password keeps the password.
const schema = z.object({
  image: z.string(),
  username: z.string(),
  bio: z.string(),
  email: z.string(),
  password: z.string().transform(password => password || undefined),
});

/** POST /settings updates the user and opens the profile. */
export async function action({ request, context }: ActionFunctionArgs) {
  const { values, errors } = parseForm(schema, await request.formData());
  if (errors) return actionErrors(errors);

  const client = context.get(apolloClientContext);
  // A new username changes cached profiles and articles, so the session
  // starts again with an empty cache.
  const { user, failure } = await authenticate(client, async () => {
    const { data } = await client.mutate({
      mutation: UPDATE_USER_MUTATION,
      variables: { user: values },
      fetchPolicy: 'no-cache',
    });
    return data?.updateUser;
  });
  if (failure) return failure;
  return redirect(paths.profile(user.username));
}

export function Component() {
  const result = useActionData<typeof action>();
  const { viewer } = useViewer();
  if (!viewer) return null;
  return (
    <>
      <title>Settings | Conduit</title>
      <SettingsForm user={viewer} errors={errorsOf(result)} />
    </>
  );
}
