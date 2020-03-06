import React from 'react';
import { Layout } from '../components/layout';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import withApollo from '../lib/with-apollo';
import { handleValidationError } from '../utils/graphql';
import { RegisterForm } from '../components/register-form';

function RegisterPage() {
  const router = useRouter();
  const [signUp] = useMutation(RegisterPageSignUpMutation);
  return (
    <Layout>
      <div className="auth-page">
        <RegisterForm
          onSubmit={(values, { setSubmitting, setStatus }) => {
            signUp({ variables: values })
              .then(() => {
                router.push('/login', '/login');
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

const RegisterPageSignUpMutation = gql`
  mutation RegisterPageSignUpMutation($input: SignUpInput!) {
    signUp(input: $input) {
      user {
        username
      }
    }
  }
`;

export default withApollo(RegisterPage);
