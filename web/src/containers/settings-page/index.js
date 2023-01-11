import * as React from 'react';
import { gql, useQuery, useMutation, NetworkStatus } from '@apollo/client';
import { useRouter } from 'next/router';
import { handleValidationError } from '../../utils/graphql';
import { UserSettingsForm } from '../../components/user-settings-form';
import { Layout } from '../layout';

function SettingsPage() {
  const router = useRouter();
  const page = useQuery(SettingsPageQuery, {
    onCompleted: React.useCallback(
      data => {
        if (data.viewer) return;

        router.replace(router.asPath, '/login', { shallow: true });
      },
      [router]
    ),
  });
  const [updateUser] = useMutation(SettingsPageUpdateUserMutation);

  if (
    page.networkStatus === NetworkStatus.loading ||
    page.networkStatus === NetworkStatus.setVariables
  ) {
    return null;
  }

  return (
    <Layout {...page.data.viewer}>
      <div className="settings-page">
        <UserSettingsForm
          onSubmit={(values, { setSubmitting, setStatus }) => {
            updateUser({ variables: values })
              .then(res => {
                router.push(
                  '/user/[username]',
                  `/user/${res.data.updateUser.user.username}`
                );
              })
              .catch(err => {
                handleValidationError(err, setStatus);
                console.error(err);
                setSubmitting(false);
              });
          }}
          {...page.data.viewer}
        />
      </div>
    </Layout>
  );
}

const SettingsPageUserFragment = gql`
  fragment SettingsPageUserFragment on User {
    ...UserSettingsFormUserFragment
  }
  ${UserSettingsForm.fragments.user}
`;

const SettingsPageQuery = gql`
  query SettingsPageQuery {
    viewer {
      ...LayoutViewerFragment
      ...SettingsPageUserFragment
    }
  }
  ${Layout.fragments.viewer}
  ${SettingsPageUserFragment}
`;

const SettingsPageUpdateUserMutation = gql`
  mutation SettingsPageUpdateUserMutation(
    $username: ID!
    $input: UpdateUserInput!
  ) {
    updateUser(username: $username, input: $input) {
      user {
        ...SettingsPageUserFragment
      }
    }
  }
  ${SettingsPageUserFragment}
`;

SettingsPage.query = SettingsPageQuery;

export default SettingsPage;
