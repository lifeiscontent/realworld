import * as React from 'react';
import { ArticleForm } from '../../components/article-form';
import { useMutation, useQuery, gql, NetworkStatus } from '@apollo/client';
import { useRouter } from 'next/router';
import { handleValidationError } from '../../utils/graphql';
import { Layout } from '../layout';

export function queryToVariables({ slug = undefined } = {}) {
  return { slug };
}

function EditorUpdatePage() {
  const router = useRouter();
  const skip = !router.query.slug;
  const page = useQuery(EditorUpdatePageQuery, {
    onCompleted: React.useCallback(
      data => {
        if (data.article.canUpdate.value) return;

        router.replace(router.asPath, '/', { shallow: true });
      },
      [router]
    ),
    skip,
    variables: queryToVariables(router.query),
  });

  const [updateArticle] = useMutation(EditorUpdatePageUpdateArticleMutation);

  if (
    page.networkStatus === NetworkStatus.loading ||
    page.networkStatus === NetworkStatus.setVariables ||
    skip
  )
    return null;

  return (
    <Layout {...page.data.viewer}>
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
          {...page.data.article}
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
