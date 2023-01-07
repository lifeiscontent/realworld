import * as React from 'react';
import { ArticleForm } from '../../components/article-form';
import { useMutation, useQuery, gql, NetworkStatus } from '@apollo/client';
import { useRouter } from 'next/router';
import { handleValidationError } from '../../utils/graphql';
import { Layout } from '../layout';

function EditorPage() {
  const router = useRouter();
  const page = useQuery(EditorPageQuery, {
    onCompleted: React.useCallback(
      data => {
        if (data.viewer?.canCreateArticle.value) return;

        router.replace(router.asPath, '/', { shallow: true });
      },
      [router]
    ),
  });
  const [createArticle] = useMutation(EditorPageCreateArticleMutation);

  if (page.networkStatus === NetworkStatus.loading) return null;

  return (
    <Layout {...page.data.viewer}>
      <div className="editor-page">
        <ArticleForm
          onSubmit={(values, { setSubmitting, setStatus }) => {
            createArticle({ variables: values })
              .then(res => {
                router.push(
                  '/article/[slug]',
                  `/article/${res.data.createArticle.article.slug}`
                );
              })
              .catch(err => {
                handleValidationError(err, setStatus);
                console.error(err);
                setSubmitting(false);
              });
          }}
        />
      </div>
    </Layout>
  );
}

const EditorPageCreateArticleMutation = gql`
  mutation EditorPageCreateArticleMutation($input: CreateArticleInput!) {
    createArticle(input: $input) {
      article {
        slug
      }
    }
  }
`;

const EditorPageQuery = gql`
  query EditorPageQuery {
    viewer {
      canCreateArticle {
        value
      }
      ...LayoutViewerFragment
    }
  }
  ${Layout.fragments.viewer}
`;

EditorPage.query = EditorPageQuery;

export default EditorPage;
