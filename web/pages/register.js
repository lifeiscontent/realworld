import React from "react";
import Link from "next/link";
import { Formik, Form, ErrorMessage } from "formik";
import { FormikSubmitButton } from "../components";
import * as Yup from "yup";

const validationSchema = Yup.object({
  input: Yup.object({
    username: Yup.string()
      .label("Username")
      .required(),
    email: Yup.string()
      .label("Email")
      .required()
      .email(),
    password: Yup.string()
      .label("Password")
      .required()
  })
});

export default function RegisterPage(props) {
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link href="/login" as="/login" shallow>
                <a>Have an account?</a>
              </Link>
            </p>
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                input: { email: "", username: "", password: "" }
              }}
            >
              <Form>
                <ul className="error-messages">
                  <ErrorMessage component="li" name="input.username" />
                  <ErrorMessage component="li" name="input.email" />
                  <ErrorMessage component="li" name="input.password" />
                </ul>
                <fieldset className="form-group">
                  <label>Username</label>
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="john.doe"
                    autoComplete="username"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <label>Email</label>
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="john.doe@example.com"
                    autoComplete="email"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <label>Password</label>
                  <input
                    className="form-control form-control-lg"
                    type="password"
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
    </div>
  );
}
