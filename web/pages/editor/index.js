import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TagsInput } from '../../containers';
import { FormikSubmitButton, FormikStatusErrors } from '../../components';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as Yup from 'yup';
import Router from 'next/router';

const validationSchema = Yup.object({
  input: Yup.object({
    title: Yup.string()
      .label('Title')
      .required(),
    description: Yup.string()
      .label('Description')
      .required(),
    body: Yup.string()
      .label('Body')
      .required(),
    tagIds: Yup.array(Yup.string())
      .label('Tags')
      .required()
  })
});

export default function EditorPage() {
  const [createArticle] = useMutation(EditorPageCreateArticleMutation);
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                input: { title: '', description: '', body: '', tagIds: [] }
              }}
              onSubmit={(values, { setSubmitting, setStatus }) => {
                createArticle({ variables: values })
                  .then(res => {
                    if (res.data.createArticle.errors.length) {
                      setStatus(res.data.createArticle.errors);
                      setSubmitting(false);
                    } else {
                      Router.push(
                        '/article/[slug]',
                        `/article/${res.data.createArticle.article.slug}`,
                        { shallow: true }
                      );
                    }
                  })
                  .catch(err => {
                    console.error(err);
                    setSubmitting(false);
                  });
              }}
            >
              <Form>
                <ul className="error-messages">
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
                  <FormikSubmitButton className="btn btn-lg pull-xs-right btn-primary">
                    Publish Article
                  </FormikSubmitButton>
                </fieldset>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

const EditorPageCreateArticleMutation = gql`
  mutation EditorPageCreateArticleMutation($input: CreateArticleInput!) {
    createArticle(input: $input) {
      errors
      article {
        slug
      }
    }
  }
`;
