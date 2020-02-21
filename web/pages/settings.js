import React from "react";
import { Formik, Form } from "formik";
import { FormikSubmitButton } from "../components";

export default function SettingsPage(props) {
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            <Formik>
              <Form>
                <fieldset>
                  <fieldset className="form-group">
                    <label>Username</label>
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="john.doe"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <label>Email</label>
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="john.doe@example.com"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <label>Password</label>
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="A secure password"
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <label>Bio</label>
                    <textarea
                      className="form-control form-control-lg"
                      rows={8}
                      placeholder="John Doe is a Loan Officer at XYZ Bank, where John processes loan applications from start to finish, including mortgage refinancing and educating clients about their different financing options. John has worked with reputable real estate agencies, including ReMax, Century 21, and Coldwell Banker, among others. John helps homeowners and new buyers secure a loan that suits their budget and goals. You can expect 100% transparency, no horror stories, and nasty surprises when working with John. John is a cat-lover and CMAS diver from Michigan."
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <label>Image Url</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="http://example.com/your-photo.jpg"
                    />
                  </fieldset>
                  <FormikSubmitButton className="btn btn-lg btn-primary pull-xs-right">
                    Update Settings
                  </FormikSubmitButton>
                </fieldset>
              </Form>
            </Formik>
            <hr />
            <button className="btn btn-outline-danger">
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
