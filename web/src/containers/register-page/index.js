import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { handleValidationError } from '../../utils/graphql';
import { RegisterForm } from '../../components/register-form';
import { Layout } from '../layout';

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

export default RegisterPage;
