import React from 'react';
import { ArticleForm } from '../../components/article-form';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { handleValidationError } from '../../utils/graphql';
import { NetworkStatus } from 'apollo-client';
import { Layout } from '../layout';

export function queryToVariables({ slug = undefined } = {}) {
  return { slug };
}

function EditorUpdatePage() {
  const router = useRouter();
  const skip = !router.query.slug;
  const editorUpdate = useQuery(EditorUpdatePageQuery, {
    onCompleted(data) {
      if (data.article.canUpdate.value) return;
      router.replace(router.asPath, '/', { shallow: true });
    },
    skip,
    variables: queryToVariables(router.query),
  });

  const [updateArticle] = useMutation(EditorUpdatePageUpdateArticleMutation);

  if (editorUpdate.networkStatus === NetworkStatus.loading || skip) return null;

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
    article: articleBySlug(slug: $slug) {
      canUpdate {
        value
      }
      ...EditorUpdatePageArticleFragment
    }
    viewer {
      ...LayoutViewerFragment
    }
  }
  ${EditorUpdatePageArticleFragment}
  ${Layout.fragments.viewer}
`;

EditorUpdatePage.query = EditorUpdatePageQuery;

export default EditorUpdatePage;
