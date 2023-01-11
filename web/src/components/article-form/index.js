import PropTypes from 'prop-types';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { FormikStatusErrors } from '../formik-status-errors';
import { FormikSubmitButton } from '../formik-submit-button';
import { TagsInput } from '../../containers/tags-input';
import * as Yup from 'yup';
import { gql } from '@apollo/client';

const createValidationSchema = Yup.object({
  input: Yup.object({
    title: Yup.string().label('Title').required(),
    description: Yup.string().label('Description').required(),
    body: Yup.string().label('Body').required(),
    tagIds: Yup.array(Yup.string())
      .label('Tags')
      .test('', '${path} is a required field', value => Array.isArray(value)),
  }),
});

const updateValidationSchema = Yup.object({
  slug: Yup.string().label('Slug').required(),
  input: Yup.object({
    title: Yup.string().label('Title').required(),
    description: Yup.string().label('Description').required(),
    body: Yup.string().label('Body').required(),
    tagIds: Yup.array(Yup.string())
      .label('Tags')
      .test('', '${path} is a required field', value => Array.isArray(value)),
  }),
});

export function ArticleForm({
  body = '',
  description = '',
  slug = '',
  tags = [],
  title = '',
  onSubmit,
}) {
  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-10 offset-md-1 col-xs-12">
          <Formik
            validationSchema={
              slug ? updateValidationSchema : createValidationSchema
            }
            initialValues={{
              slug,
              input: {
                title,
                description,
                body,
                tagIds: tags.map(tag => tag.id),
              },
            }}
            onSubmit={onSubmit}
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
                  <label htmlFor="article-form-description-input">
                    Description
                  </label>
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
                  <TagsInput
                    name="input.tagIds"
                    id="article-form-tags-ids-input"
                  />
                </fieldset>
                <FormikSubmitButton className="btn btn-lg pull-xs-right btn-primary">
                  Publish Article
                </FormikSubmitButton>
              </fieldset>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

ArticleForm.fragments = {
  article: gql`
    fragment ArticleFormArticleFragment on Article {
      body
      description
      slug
      tags {
        id
        name
      }
      title
    }
  `,
};

ArticleForm.propTypes = {
  body: PropTypes.string,
  description: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  slug: PropTypes.string,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired
  ),
  title: PropTypes.string,
};
