import React from "react";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { FormikSubmitButton, FormikStatusErrors } from "../components";
import { useMutation } from "@apollo/react-hooks";
import * as Yup from "yup";

export const LoginPageAuthenticateMutation = gql`
  mutation LoginPageAuthenticateMutation($input: AuthenticateInput!) {
    authenticate(input: $input) {
      errors
      token
      user {
        email
        id
        profile {
          id
          username
        }
      }
    }
  }
`;

const validationSchema = Yup.object({
  input: Yup.object({
    email: Yup.string()
      .label("Email")
      .email()
      .required(),
    password: Yup.string()
      .label("Password")
      .required()
  })
});

export default function LoginPage(props) {
  const router = useRouter();
  const [authenticate] = useMutation(LoginPageAuthenticateMutation);
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <a href="/register">Need an account?</a>
            </p>
            <Formik
              validationSchema={validationSchema}
              initialStatus={[]}
              initialValues={{ input: { email: "", password: "" } }}
              onSubmit={(values, { setSubmitting, setStatus, status }) => {
                authenticate({
                  variables: values
                })
                  .then(res => {
                    if (res.data.authenticate.errors.length) {
                      setStatus(res.data.authenticate.errors);
                    } else if (res.data.authenticate.token) {
                      localStorage.setItem(
                        "token",
                        res.data.authenticate.token
                      );
                      router.push("/feed", undefined, { shallow: true });
                    }
                  })
                  .catch(err => console.error(err));
                setSubmitting(false);
              }}
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
                  />
                </fieldset>
                <fieldset className="form-group">
                  <label>Password</label>
                  <Field
                    name="input.password"
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="A strong password"
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
    </div>
  );
}
