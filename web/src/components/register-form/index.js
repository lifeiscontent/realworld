import PropTypes from 'prop-types';
import Link from 'next/link';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { FormikStatusErrors } from '../formik-status-errors';
import { FormikSubmitButton } from '../formik-submit-button';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  input: Yup.object({
    username: Yup.string().label('Username').required(),
    email: Yup.string().label('Email').required().email(),
    password: Yup.string().label('Password').required(),
  }),
});

export function RegisterForm({ onSubmit }) {
  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-xs-center">Sign up</h1>
          <p className="text-xs-center">
            <Link href="/login">Have an account?</Link>
          </p>
          <Formik
            validationSchema={validationSchema}
            initialStatus={[]}
            initialValues={{
              input: { email: '', username: '', password: '' },
            }}
            onSubmit={onSubmit}
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
  );
}

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
