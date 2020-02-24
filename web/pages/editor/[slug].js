import React from 'react';
import { ArticleForm } from '../../components';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as Yup from 'yup';
import { useRouter } from 'next/router';

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

export default function EditorPage() {
  const router = useRouter();
  const editorPage = useQuery(EditorPageQuery, {
    variables: {
      slug: router.query.slug
    },
    skip: typeof router.query.slug !== 'string'
  });
  const [updateArticle] = useMutation(EditorPageUpdateArticleMutation);
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ArticleForm
              validationSchema={validationSchema}
              initialValues={{
                slug: editorPage.data?.article?.slug ?? '',
                input: {
                  title: editorPage.data?.article?.title ?? '',
                  description: editorPage.data?.article?.description ?? '',
                  body: editorPage.data?.article?.body ?? '',
                  tagIds: (editorPage.data?.article?.tags ?? []).map(
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
                        `/article/${res.data.updateArticle.article.slug}`,
                        { shallow: true }
                      );
                    }
                  })
                  .catch(err => {
                    console.error(err);
                    setSubmitting(false);
                  });
              }}
              disabled={editorPage.loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const EditorPageUpdateArticleMutation = gql`
  mutation EditorPageUpdateArticleMutation(
    $slug: String!
    $input: UpdateArticleInput!
  ) {
    updateArticle(slug: $slug, input: $input) {
      errors
      article {
        slug
      }
    }
  }
`;

const EditorPageQuery = gql`
  query EditorPageQuery($slug: String!) {
    article: articleBySlug(slug: $slug) {
      body
      description
      slug
      title
      tags {
        id
        name
      }
    }
  }
`;
