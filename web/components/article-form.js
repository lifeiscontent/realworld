import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { FormikStatusErrors, FormikSubmitButton } from './formik';
import { TagsInput } from '../containers';

export function ArticleForm(props) {
  return (
    <Formik
      validationSchema={props.validationSchema}
      enableReinitialize
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
    >
      <Form>
        <ul className="error-messages">
          <ErrorMessage component="li" name="slug" />
          <ErrorMessage component="li" name="input.title" />
          <ErrorMessage component="li" name="input.description" />
          <ErrorMessage component="li" name="input.body" />
          <ErrorMessage component="li" name="input.tagId" />
          <FormikStatusErrors />
        </ul>

        <fieldset>
          <fieldset className="form-group">
            <label>Article Title</label>
            <Field
              name="input.title"
              type="text"
              className="form-control form-control-lg"
              placeholder="How to build webapps that scale"
            />
          </fieldset>
          <fieldset className="form-group">
            <label>Description</label>
            <Field
              name="input.description"
              type="text"
              className="form-control"
              placeholder="Rock solid process you can follow when building your apps"
            />
          </fieldset>
          <fieldset className="form-group">
            <label>Body</label>
            <Field
              name="input.body"
              as="textarea"
              className="form-control"
              rows={8}
              placeholder={`# Introducing RealWorld.\n\nIt's a great solution for learning how other frameworks work.`}
            />
          </fieldset>
          <fieldset className="form-group">
            <label>Tags</label>
            <TagsInput name="input.tagIds" />
          </fieldset>
          <FormikSubmitButton
            disabled={props.disabled}
            className="btn btn-lg pull-xs-right btn-primary"
          >
            Publish Article
          </FormikSubmitButton>
        </fieldset>
      </Form>
    </Formik>
  );
}

ArticleForm.propTypes = {
  disabled: PropTypes.bool,
  validationSchema: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
};
