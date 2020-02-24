import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TagsInput } from '../../containers';
import {
  FormikSubmitButton,
  FormikStatusErrors,
  ArticleForm
} from '../../components';
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
            <ArticleForm
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
            />
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
