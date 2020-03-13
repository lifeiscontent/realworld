import React from 'react';
import { Layout } from '../components/layout';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { withApollo } from '../lib/apollo';
import { handleValidationError } from '../utils/graphql';
import { UserSettingsForm } from '../components/user-settings-form';

function SettingsPage() {
  const router = useRouter();
  const settings = useQuery(SettingsPageQuery);
  const [updateUser] = useMutation(SettingsPageUpdateUserMutation);

  if (settings.loading) return null;

  return (
    <Layout {...settings.data.viewer}>
      <div className="settings-page">
        <UserSettingsForm
          onSubmit={(values, { setSubmitting, setStatus }) => {
            updateUser({ variables: values })
              .then(res => {
                router.push(
                  '/[username]',
                  `/${res.data.updateUser.user.username}`
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

export default withApollo()(SettingsPage);
