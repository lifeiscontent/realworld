import React from 'react';
import { ArticleForm } from '../../components/article-form';
import { Layout } from '../../components/layout';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import withApollo from '../../lib/with-apollo';

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

function EditorPage() {
  const router = useRouter();
  const editor = useQuery(EditorPageQuery);
  const [createArticle] = useMutation(EditorPageCreateArticleMutation);
  return (
    <Layout userId={editor.data.viewer?.id}>
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
                        router.push(
                          '/article/[slug]',
                          `/article/${res.data.createArticle.article.slug}`
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
    </Layout>
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

const EditorPageQuery = gql`
  query EditorPageQuery {
    viewer {
      ...LayoutUserFragment
    }
  }
  ${Layout.fragments.user}
`;

export default withApollo(EditorPage);
