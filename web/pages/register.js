import React from 'react';
import Link from 'next/link';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { FormikSubmitButton } from '../components/formik/formik-submit-button';
import { FormikStatusErrors } from '../components/formik/formik-status-errors';
import { withLayout } from '../components/layout';
import * as Yup from 'yup';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import withApollo from '../lib/with-apollo';

const validationSchema = Yup.object({
  input: Yup.object({
    username: Yup.string()
      .label('Username')
      .required(),
    email: Yup.string()
      .label('Email')
      .required()
      .email(),
    password: Yup.string()
      .label('Password')
      .required()
  })
});

const RegisterPageSignUpMutation = gql`
  mutation RegisterPageSignUpMutation($input: SignUpInput!) {
    signUp(input: $input) {
      user {
        id
        profile {
          username
        }
      }
      errors
    }
  }
`;

function RegisterPage() {
  const router = useRouter();
  const [signUp] = useMutation(RegisterPageSignUpMutation);
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link href="/login" as="/login">
                <a>Have an account?</a>
              </Link>
            </p>
            <Formik
              validationSchema={validationSchema}
              initialStatus={[]}
              initialValues={{
                input: { email: '', username: '', password: '' }
              }}
              onSubmit={(values, { setSubmitting, setStatus }) => {
                signUp({ variables: values })
                  .then(res => {
                    if (res.data.signUp.errors.length) {
                      setStatus(res.data.signUp.errors);
                      setSubmitting(false);
                    } else if (res.data.signUp.user) {
                      router.push('/login', '/login');
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
                  <FormikStatusErrors />
                </ul>
                <fieldset className="form-group">
                  <label>Username</label>
                  <Field
                    className="form-control form-control-lg"
                    type="text"
                    name="input.username"
                    placeholder="john.doe"
                    autoComplete="username"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <label>Email</label>
                  <Field
                    className="form-control form-control-lg"
                    type="email"
                    name="input.email"
                    placeholder="john.doe@example.com"
                    autoComplete="email"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <label>Password</label>
                  <Field
                    className="form-control form-control-lg"
                    type="password"
                    name="input.password"
                    placeholder="A secure password"
                    autoComplete="new-password"
                  />
                </fieldset>
                <FormikSubmitButton className="btn btn-lg btn-primary pull-xs-right">
                  Sign up
                </FormikSubmitButton>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withApollo(withLayout(RegisterPage));
