import React from 'react';
import { ArticleForm } from '../../components/article-form';
import { Layout } from '../../components/layout';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import withApollo from '../../lib/with-apollo';
import { handleValidationError } from '../../utils/graphql';

function EditorUpdatePage() {
  const router = useRouter();
  const editorUpdate = useQuery(EditorUpdatePageQuery, {
    variables: {
      slug: router.query.slug
    }
  });
  const [updateArticle] = useMutation(EditorUpdatePageUpdateArticleMutation);

  if (editorUpdate.loading) return null;

  return (
    <Layout {...editorUpdate.data.viewer}>
      <div className="editor-page">
        <ArticleForm
          onSubmit={(values, { setSubmitting, setStatus }) => {
            updateArticle({ variables: values })
              .then(res => {
                router.push(
                  '/article/[slug]',
                  `/article/${res.data.updateArticle.article.slug}`
                );
              })
              .catch(err => {
                handleValidationError(err, setStatus);
                console.error(err);
                setSubmitting(false);
              });
          }}
          {...editorUpdate.data.article}
        />
      </div>
    </Layout>
  );
}

const EditorUpdatePageArticleFragment = gql`
  fragment EditorUpdatePageArticleFragment on Article {
    ...ArticleFormArticleFragment
  }
  ${ArticleForm.fragments.article}
`;

const EditorUpdatePageUpdateArticleMutation = gql`
  mutation EditorUpdatePageUpdateArticleMutation(
    $slug: ID!
    $input: UpdateArticleInput!
  ) {
    updateArticle(slug: $slug, input: $input) {
      article {
        ...EditorUpdatePageArticleFragment
      }
    }
  }
  ${EditorUpdatePageArticleFragment}
`;

const EditorUpdatePageQuery = gql`
  query EditorUpdatePageQuery($slug: ID!) {
    viewer {
      ...LayoutViewerFragment
    }
    article: articleBySlug(slug: $slug) {
      ...EditorUpdatePageArticleFragment
    }
  }
  ${EditorUpdatePageArticleFragment}
  ${Layout.fragments.viewer}
`;

export default withApollo(EditorUpdatePage);
