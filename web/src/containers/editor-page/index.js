import React from 'react';
import { ArticleForm } from '../../components/article-form';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';

import { handleValidationError } from '../../utils/graphql';
import { NetworkStatus } from 'apollo-client';
import { Layout } from '../layout';

function EditorPage() {
  const router = useRouter();
  const editor = useQuery(EditorPageQuery, {
    onCompleted(data) {
      if (data.canCreateArticle.value) return;
      router.replace(router.asPath, '/', { shallow: true });
    },
  });
  const [createArticle] = useMutation(EditorPageCreateArticleMutation);

  if (editor.networkStatus === NetworkStatus.loading) return null;

  return (
    <Layout>
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

export const EditorPageQuery = gql`
  query EditorPageQuery {
    canCreateArticle {
      value
    }
  }
`;

EditorPage.query = EditorPageQuery;

export default EditorPage;
