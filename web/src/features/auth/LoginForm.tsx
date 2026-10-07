import { Form, href, Link } from 'react-router';

import { ErrorMessages } from '../../ui/ErrorMessages';
import { SubmitButton } from '../../ui/SubmitButton';
import { TextField } from '../../ui/TextField';

interface LoginFormProps {
  errors?: ReadonlyArray<string>;
}

export function LoginForm({ errors }: LoginFormProps) {
  return (
    <>
      <h1 className="text-xs-center">Sign in</h1>
      <p className="text-xs-center">
        <Link to={href('/register')}>Need an account?</Link>
      </p>
      <ErrorMessages messages={errors} />
      <Form method="post">
        <TextField label="Email" name="email" size="lg" autoComplete="email" />
        <TextField
          label="Password"
          name="password"
          type="password"
          size="lg"
          autoComplete="current-password"
        />
        <SubmitButton variant="primary" size="lg" className="pull-xs-right">
          Sign in
        </SubmitButton>
      </Form>
    </>
  );
}
