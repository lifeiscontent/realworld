import React from 'react';
import { Layout } from '../components/layout';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import withApollo from '../lib/with-apollo';
import { handleValidationError } from '../utils/graphql';
import { SettingsForm } from '../components/settings-form';

function SettingsPage() {
  const router = useRouter();
  const settings = useQuery(SettingsPageQuery);
  const [updateUser] = useMutation(SettingsPageUpdateUserMutation, {
    update(proxy, mutationResult) {
      proxy.writeData({
        id: proxy.config.dataIdFromObject(mutationResult.data.updateUser.user),
        data: mutationResult.data.updateUser.user
      });
      proxy.writeData({
        id: proxy.config.dataIdFromObject(
          mutationResult.data.updateUser.user.profile
        ),
        data: mutationResult.data.updateUser.user.profile
      });
    }
  });

  if (settings.loading) return null;

  return (
    <Layout userUsername={settings.data.viewer.username}>
      <div className="settings-page">
        <SettingsForm
          initialValues={{
            username: settings.data.viewer.username,
            input: {
              email: settings.data.viewer.email,
              password: '',
              username: settings.data.viewer.username,
              profile: {
                bio: settings.data.viewer.profile.bio ?? '',
                imageUrl: settings.data.viewer.profile.imageUrl ?? ''
              }
            }
          }}
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
        />
      </div>
    </Layout>
  );
}

SettingsPage.fragmants = {
  user: gql`
    fragment SettingsPageUserFragment on User {
      username
      email
      profile {
        bio
        imageUrl
      }
    }
  `
};

const SettingsPageQuery = gql`
  query SettingsPageQuery {
    viewer {
      ...SettingsPageUserFragment
    }
  }
  ${SettingsPage.fragmants.user}
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
  ${SettingsPage.fragmants.user}
`;

export default withApollo(SettingsPage);
