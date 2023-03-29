import cookie from 'cookie';
import { gql, useMutation } from '@apollo/client';
import { handleValidationError } from '../../utils/graphql';
import { LoginForm } from '../../components/login-form';
import { Layout } from '../layout';

function LoginPage() {
  const [signIn] = useMutation(LoginPageSignInMutation);

  return (
    <Layout>
      <div className="auth-page">
        <LoginForm
          onSubmit={(values, { setSubmitting, setStatus }) => {
            signIn({
              variables: values,
            })
              .then(res => {
                document.cookie = cookie.serialize(
                  'authorization',
                  `Bearer ${res.data.signIn.token}`,
                  {
                    maxAge: 60 * 60 * 24,
                    path: '/',
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                  }
                );
                window.location.assign('/');
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

export default LoginPage;
