import PropTypes from 'prop-types';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { FormikStatusErrors } from '../formik-status-errors';
import { FormikSubmitButton } from '../formik-submit-button';
import Link from 'next/link';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  input: Yup.object({
    email: Yup.string().label('Email').email().required(),
    password: Yup.string().label('Password').required(),
  }),
});

export function LoginForm({ onSubmit }) {
  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-xs-center">Sign in</h1>
          <p className="text-xs-center">
            <Link href="/register">Need an account?</Link>
          </p>
          <Formik
            validationSchema={validationSchema}
            initialStatus={[]}
            initialValues={{ input: { email: '', password: '' } }}
            onSubmit={onSubmit}
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
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
