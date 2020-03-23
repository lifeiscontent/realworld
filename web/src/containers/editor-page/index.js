import React, { useEffect } from 'react';
import { ArticleForm } from '../../components/article-form';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { withLayout } from '../../hocs/with-layout';

import { handleValidationError } from '../../utils/graphql';
import { NetworkStatus } from 'apollo-client';

function EditorPage() {
  const router = useRouter();
  const editor = useQuery(EditorPageQuery);
  const [createArticle] = useMutation(EditorPageCreateArticleMutation);

  useEffect(() => {
    if (
      editor.networkStatus === NetworkStatus.loading ||
      editor.networkStatus === undefined ||
      editor.data.canCreateArticle.value
    )
      return;
    router.replace(router.asPath, '/', { shallow: true });
  }, [editor.data, editor.networkStatus, router]);

  if (
    editor.networkStatus === NetworkStatus.loading ||
    editor.networkStatus === undefined ||
    !editor.data.canCreateArticle.value
  )
    return null;

  return (
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

export default withLayout(EditorPage);
