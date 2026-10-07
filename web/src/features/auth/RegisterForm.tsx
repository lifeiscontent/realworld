import { Form, href, Link } from 'react-router';

import { ErrorMessages } from '../../ui/ErrorMessages';
import { SubmitButton } from '../../ui/SubmitButton';
import { TextField } from '../../ui/TextField';

interface RegisterFormProps {
  errors?: ReadonlyArray<string>;
}

export function RegisterForm({ errors }: RegisterFormProps) {
  return (
    <>
      <h1 className="text-xs-center">Sign up</h1>
      <p className="text-xs-center">
        <Link to={href('/login')}>Have an account?</Link>
      </p>
      <ErrorMessages messages={errors} />
      <Form method="post">
        <TextField
          label="Username"
          name="username"
          size="lg"
          autoComplete="username"
        />
        <TextField label="Email" name="email" size="lg" autoComplete="email" />
        <TextField
          label="Password"
          name="password"
          type="password"
          size="lg"
          autoComplete="new-password"
        />
        <SubmitButton variant="primary" size="lg" className="pull-xs-right">
          Sign up
        </SubmitButton>
      </Form>
    </>
  );
}
