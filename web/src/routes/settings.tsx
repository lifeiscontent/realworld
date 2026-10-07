import { gql, type TypedDocumentNode } from '@apollo/client';
import { href, redirect } from 'react-router';
import { z } from 'zod';

import { apolloClientContext } from '../app/context';
import {
  authenticate,
  useSignedInViewer,
  VIEWER_FRAGMENT,
} from '../app/viewer';
import { SettingsForm } from '../features/auth/SettingsForm';
import { FormPage } from '../layout/FormPage';
import { actionErrors, errorsOf, parseForm } from '../lib/forms';
import { pageMeta } from '../lib/meta';
import type {
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from '../types/__generated__/graphql';
import type { Route } from './+types/settings';

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
export const meta: Route.MetaFunction = ({ error }) =>
  pageMeta('Settings', error);

export async function clientAction({
  request,
  context,
}: Route.ClientActionArgs) {
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
  return redirect(
    href('/profile/:username/:tab?', { username: user.username })
  );
}

export default function Settings({ actionData }: Route.ComponentProps) {
  const viewer = useSignedInViewer();
  return (
    <FormPage page="settings-page" width="narrow">
      <SettingsForm user={viewer} errors={errorsOf(actionData)} />
    </FormPage>
  );
}
