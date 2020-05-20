import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { withLayout } from '../../hocs/with-layout';
import { handleValidationError } from '../../utils/graphql';
import { UserSettingsForm } from '../../components/user-settings-form';
import { NetworkStatus } from 'apollo-client';

function SettingsPage() {
  const router = useRouter();
  const settings = useQuery(SettingsPageQuery);
  const [updateUser] = useMutation(SettingsPageUpdateUserMutation);

  useEffect(() => {
    if (
      settings.networkStatus === NetworkStatus.loading ||
      !!settings.data.viewer
    )
      return;
    router.replace(router.asPath, '/login', { shallow: true });
  }, [settings.data, settings.networkStatus, router]);

  if (settings.networkStatus === NetworkStatus.loading) return null;

  return (
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
        {...settings.data.viewer}
      />
    </div>
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
      ...SettingsPageUserFragment
    }
  }
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

export default withLayout(SettingsPage);
