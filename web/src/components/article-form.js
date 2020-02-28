import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { FormikStatusErrors } from './formik/formik-status-errors';
import { FormikSubmitButton } from './formik/formik-submit-button';
import { TagsInput } from '../containers/tags-input';

export function ArticleForm(props) {
  return (
    <Formik
      validationSchema={props.validationSchema}
      enableReinitialize
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
    >
      <Form id="article-form">
        <ul className="error-messages">
          <ErrorMessage component="li" name="slug" />
          <ErrorMessage component="li" name="input.title" />
          <ErrorMessage component="li" name="input.description" />
          <ErrorMessage component="li" name="input.body" />
          <ErrorMessage component="li" name="input.tagIds" />
          <FormikStatusErrors />
        </ul>

        <fieldset>
          <fieldset className="form-group">
            <label htmlFor="article-form-title-input">Title</label>
            <Field
              name="input.title"
              type="text"
              id="article-form-title-input"
              className="form-control form-control-lg"
              placeholder="How to build webapps that scale"
            />
          </fieldset>
          <fieldset className="form-group">
            <label htmlFor="article-form-description-input">Description</label>
            <Field
              name="input.description"
              type="text"
              id="article-form-description-input"
              className="form-control"
              placeholder="Web development technologies have evolved at an incredible clip over the past few years."
            />
          </fieldset>
          <fieldset className="form-group">
            <label htmlFor="article-form-body-textarea">Body</label>
            <Field
              name="input.body"
              as="textarea"
              className="form-control"
              id="article-form-body-textarea"
              rows={8}
              placeholder={`# Introducing RealWorld.\n\nIt's a great solution for learning how other frameworks work.`}
            />
          </fieldset>
          <fieldset className="form-group">
            <label htmlFor="article-form-tags-ids-input">Tags</label>
            <TagsInput name="input.tagIds" id="article-form-tags-ids-input" />
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
