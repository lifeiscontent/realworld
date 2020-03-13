import React from 'react';
import gql from 'graphql-tag';
import { Layout } from '../components/layout';
import { useMutation } from '@apollo/react-hooks';
import { withApollo } from '../lib/apollo';
import { handleValidationError } from '../utils/graphql';
import { LoginForm } from '../components/login-form';

function LoginPage() {
  const [signIn] = useMutation(LoginPageSignInMutation);
  return (
    <Layout>
      <div className="auth-page">
        <LoginForm
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
        />
      </div>
    </Layout>
  );
}

const LoginPageSignInMutation = gql`
  mutation LoginPageSignInMutation($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        email
        username
      }
    }
  }
`;

export default withApollo()(LoginPage);
