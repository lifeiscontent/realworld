import React from 'react';
import gql from 'graphql-tag';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { FormikSubmitButton } from '../components/formik/formik-submit-button';
import { FormikStatusErrors } from '../components/formik/formik-status-errors';
import { Layout } from '../components/layout';
import { useMutation } from '@apollo/react-hooks';
import * as Yup from 'yup';
import withApollo from '../lib/with-apollo';
import { handleValidationError } from '../utils/graphql';

const LoginPageSignInMutation = gql`
  mutation LoginPageSignInMutation($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        id
        email
        profile {
          username
        }
      }
    }
  }
`;

const validationSchema = Yup.object({
  input: Yup.object({
    email: Yup.string()
      .label('Email')
      .email()
      .required(),
    password: Yup.string()
      .label('Password')
      .required()
  })
});

function LoginPage() {
  const [signIn] = useMutation(LoginPageSignInMutation);
  return (
    <Layout>
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign in</h1>
              <p className="text-xs-center">
                <a href="/register">Need an account?</a>
              </p>
              <Formik
                validationSchema={validationSchema}
                initialStatus={[]}
                initialValues={{ input: { email: '', password: '' } }}
                onSubmit={(values, { setSubmitting, setStatus }) => {
                  signIn({
                    variables: values
                  })
                    .then(res => {
                      fetch('/api/login', {
                        method: 'POST',
                        body: res.data.signIn.token
                      }).then(() => {
                        window.location = '/';
                      });
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
                    <FormikStatusErrors />
                  </ul>
                  <fieldset className="form-group">
                    <label>Email</label>
                    <Field
                      name="input.email"
                      className="form-control form-control-lg"
                      type="text"
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
                      placeholder="A strong password"
                      autoComplete="current-password"
                    />
                  </fieldset>
                  <FormikSubmitButton className="btn btn-lg btn-primary pull-xs-right">
                    Sign in
                  </FormikSubmitButton>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withApollo(LoginPage);
