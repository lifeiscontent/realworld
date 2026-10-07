import { Form, Link } from 'react-router';
import { ErrorMessages } from './ErrorMessages';
import { SubmitButton } from './SubmitButton';

interface LoginFormProps {
  errors?: ReadonlyArray<string>;
}

export function LoginForm({ errors = [] }: LoginFormProps) {
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <Link to="/register">Need an account?</Link>
            </p>
            <ErrorMessages messages={errors} />
            <Form method="post">
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="email"
                  placeholder="Email"
                  aria-label="Email"
                  autoComplete="email"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  name="password"
                  placeholder="Password"
                  aria-label="Password"
                  autoComplete="current-password"
                />
              </fieldset>
              <SubmitButton className="btn btn-lg btn-primary pull-xs-right">
                Sign in
              </SubmitButton>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
