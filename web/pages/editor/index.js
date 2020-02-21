import React from "react";
import { Formik, Form } from "formik";

export default function EditorPage(props) {
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <Formik>
              <Form>
                <fieldset>
                  <fieldset className="form-group">
                    <label>Article Title</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="How to build webapps that scale"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Rock solid process you can follow when building your apps"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <label>Body</label>
                    <textarea
                      className="form-control"
                      rows={8}
                      placeholder={`# Introducing RealWorld.\n\nIt's a great solution for learning how other frameworks work.`}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <label>Tags</label>
                    <p>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Press enter to add tag to list"
                      />
                    </p>
                    <div className="tag-list">
                      <span className="tag-default tag-pill">
                        <i className="ion-close-round" />
                        tag
                      </span>
                    </div>
                  </fieldset>
                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="button"
                  >
                    Publish Article
                  </button>
                </fieldset>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
