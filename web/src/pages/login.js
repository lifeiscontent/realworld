import React from 'react';
import cookie from 'cookie';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { withApollo } from '../hocs/with-apollo';
import { withLayout } from '../hocs/with-layout';
import { handleValidationError } from '../utils/graphql';
import { LoginForm } from '../components/login-form';

function LoginPage() {
  const [signIn] = useMutation(LoginPageSignInMutation);
  return (
    <div className="auth-page">
      <LoginForm
        onSubmit={(values, { setSubmitting, setStatus }) => {
          signIn({
            variables: values
          })
            .then(res => {
              document.cookie = cookie.serialize(
                'authorization',
                `Bearer ${res.data.signIn.token}`,
                {
                  maxAge: 60 * 60 * 24,
                  path: '/',
                  sameSite: 'lax',
                  secure: process.env.NODE_ENV === 'production'
                }
              );
              window.location = '/';
            })
            .catch(err => {
              handleValidationError(err, setStatus);
              console.error(err);
              setSubmitting(false);
            });
        }}
      />
    </div>
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

export default withApollo()(withLayout(LoginPage));
