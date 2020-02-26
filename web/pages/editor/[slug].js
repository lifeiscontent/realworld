import React from 'react';
import { ArticleForm, withLayout } from '../../components';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import withApollo from '../../lib/with-apollo';

const validationSchema = Yup.object({
  slug: Yup.string()
    .label('Slug')
    .required(),
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

function EditorUpdatePage() {
  const router = useRouter();
  const editorUpdatePage = useQuery(EditorUpdatePageQuery, {
    variables: {
      slug: router.query.slug
    }
  });
  const [updateArticle] = useMutation(EditorUpdatePageUpdateArticleMutation);

  if (editorUpdatePage.loading) return null;

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ArticleForm
              validationSchema={validationSchema}
              initialValues={{
                slug: editorUpdatePage.data.article.slug ?? '',
                input: {
                  title: editorUpdatePage.data.article.title ?? '',
                  description: editorUpdatePage.data.article.description ?? '',
                  body: editorUpdatePage.data.article.body ?? '',
                  tagIds: (editorUpdatePage.data.article.tags ?? []).map(
                    tag => tag.id
                  )
                }
              }}
              onSubmit={(values, { setSubmitting, setStatus }) => {
                updateArticle({ variables: values })
                  .then(res => {
                    if (res.data.updateArticle.errors.length) {
                      setStatus(res.data.updateArticle.errors);
                      setSubmitting(false);
                    } else {
                      router.push(
                        '/article/[slug]',
                        `/article/${res.data.updateArticle.article.slug}`
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

EditorUpdatePage.fragment = {
  article: gql`
    fragment EditorUpdatePageArticleFragment on Article {
      body
      description
      slug
      title
      tags {
        id
        name
      }
    }
  `
};

const EditorUpdatePageUpdateArticleMutation = gql`
  mutation EditorUpdatePageUpdateArticleMutation(
    $slug: String!
    $input: UpdateArticleInput!
  ) {
    updateArticle(slug: $slug, input: $input) {
      errors
      article {
        ...EditorUpdatePageArticleFragment
      }
    }
  }
  ${EditorUpdatePage.fragment.article}
`;

const EditorUpdatePageQuery = gql`
  query EditorUpdatePageQuery($slug: String!) {
    article: articleBySlug(slug: $slug) {
      ...EditorUpdatePageArticleFragment
    }
  }
  ${EditorUpdatePage.fragment.article}
`;

export default withApollo(withLayout(EditorUpdatePage));
