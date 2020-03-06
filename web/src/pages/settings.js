import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormikSubmitButton } from '../components/formik/formik-submit-button';
import { FormikStatusErrors } from '../components/formik/formik-status-errors';
import { Layout } from '../components/layout';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import withApollo from '../lib/with-apollo';
import { handleValidationError } from '../utils/graphql';

const validationSchema = Yup.object({
  username: Yup.string().required(),
  input: Yup.object({
    email: Yup.string()
      .email()
      .required(),
    password: Yup.string(),
    username: Yup.string().required(),
    profile: Yup.object({
      bio: Yup.string(),
      imageUrl: Yup.string()
    })
  })
});

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
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>
              <Formik
                validationSchema={validationSchema}
                initialStatus={[]}
                enableReinitialize
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
              >
                <Form>
                  <ul className="error-messages">
                    <ErrorMessage component="li" name="input.email" />
                    <ErrorMessage component="li" name="input.password" />
                    <ErrorMessage component="li" name="input.username" />
                    <ErrorMessage component="li" name="input.profile.bio" />
                    <ErrorMessage
                      component="li"
                      name="input.profile.imageUrl"
                    />
                    <FormikStatusErrors />
                  </ul>
                  <fieldset>
                    <fieldset className="form-group">
                      <label>Email</label>
                      <Field
                        name="input.email"
                        className="form-control form-control-lg"
                        type="email"
                        placeholder="john.doe@example.com"
                        autoComplete="email"
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <label>Password</label>
                      <Field
                        name="input.password"
                        className="form-control form-control-lg"
                        type="password"
                        placeholder="A secure password"
                        autoComplete="new-password"
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <label>Username</label>
                      <Field
                        name="input.username"
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="john.doe"
                        autoComplete="username"
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <label>Bio</label>
                      <Field
                        name="input.profile.bio"
                        as="textarea"
                        className="form-control form-control-lg"
                        rows={8}
                        placeholder="John Doe is a Loan Officer at XYZ Bank, where John processes loan applications from start to finish, including mortgage refinancing and educating clients about their different financing options. John has worked with reputable real estate agencies, including ReMax, Century 21, and Coldwell Banker, among others. John helps homeowners and new buyers secure a loan that suits their budget and goals. You can expect 100% transparency, no horror stories, and nasty surprises when working with John. John is a cat-lover and CMAS diver from Michigan."
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <label>Image Url</label>
                      <Field
                        name="input.profile.imageUrl"
                        className="form-control"
                        type="text"
                        placeholder="http://example.com/your-photo.jpg"
                      />
                    </fieldset>
                    <FormikSubmitButton className="btn btn-lg btn-primary pull-xs-right">
                      Update Settings
                    </FormikSubmitButton>
                  </fieldset>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
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
      username
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
