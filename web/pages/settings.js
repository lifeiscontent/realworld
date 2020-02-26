import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormikSubmitButton } from '../components/formik/formik-submit-button';
import { FormikStatusErrors } from '../components/formik/formik-status-errors';
import { withLayout } from '../components/layout';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import withApollo from '../lib/with-apollo';

const validationSchema = Yup.object({
  id: Yup.string().required(),
  input: Yup.object({
    email: Yup.string()
      .email()
      .required(),
    username: Yup.string().required(),
    password: Yup.string(),
    bio: Yup.string(),
    imageUrl: Yup.string()
  })
});

function SettingsPage() {
  const router = useRouter();
  const settings = useQuery(SettingsPageQuery);
  const [updateSettings] = useMutation(SettingsPageUpdateSettingsMutation, {
    update(proxy, mutationResult) {
      proxy.writeData({
        id: proxy.config.dataIdFromObject(
          mutationResult.data.updateSettings.user
        ),
        data: mutationResult.data.updateSettings.user
      });
      proxy.writeData({
        id: proxy.config.dataIdFromObject(
          mutationResult.data.updateSettings.user.profile
        ),
        data: mutationResult.data.updateSettings.user.profile
      });
    }
  });

  if (settings.loading) return null;

  return (
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
                id: settings.data.viewer.id,
                input: {
                  email: settings.data.viewer.email,
                  username: settings.data.viewer.profile.username,
                  bio: settings.data.viewer.profile.bio ?? '',
                  imageUrl: settings.data.viewer.profile.imageUrl ?? ''
                }
              }}
              onSubmit={(values, { setSubmitting, setStatus }) => {
                updateSettings({ variables: values })
                  .then(res => {
                    if (res.data.updateSettings.errors.length) {
                      setStatus(res.data.updateSettings.errors);
                      setSubmitting(false);
                    } else {
                      router.push(
                        '/[username]',
                        `/${res.data.updateSettings.user.profile.username}`
                      );
                    }
                  })
                  .catch(err => {
                    console.error(err);
                    setSubmitting(false);
                  });
              }}
            >
              <Form>
                <ul className="error-messages">
                  <ErrorMessage component="li" name="input.username" />
                  <ErrorMessage component="li" name="input.email" />
                  <ErrorMessage component="li" name="input.password" />
                  <ErrorMessage component="li" name="input.bio" />
                  <ErrorMessage component="li" name="input.imageUrl" />
                  <FormikStatusErrors />
                </ul>
                <fieldset>
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
                    <label>Bio</label>
                    <Field
                      name="input.bio"
                      as="textarea"
                      className="form-control form-control-lg"
                      rows={8}
                      placeholder="John Doe is a Loan Officer at XYZ Bank, where John processes loan applications from start to finish, including mortgage refinancing and educating clients about their different financing options. John has worked with reputable real estate agencies, including ReMax, Century 21, and Coldwell Banker, among others. John helps homeowners and new buyers secure a loan that suits their budget and goals. You can expect 100% transparency, no horror stories, and nasty surprises when working with John. John is a cat-lover and CMAS diver from Michigan."
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <label>Image Url</label>
                    <Field
                      name="input.imageUrl"
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
  );
}

SettingsPage.fragmants = {
  user: gql`
    fragment SettingsPageUserFragment on User {
      id
      email
      profile {
        username
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

const SettingsPageUpdateSettingsMutation = gql`
  mutation SettingsPageUpdateSettingsMutation(
    $id: ID!
    $input: UpdateSettingsInput!
  ) {
    updateSettings(id: $id, input: $input) {
      errors
      user {
        ...SettingsPageUserFragment
      }
    }
  }
  ${SettingsPage.fragmants.user}
`;

export default withApollo(withLayout(SettingsPage));
