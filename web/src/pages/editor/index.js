import React from 'react';
import { ArticleForm } from '../../components/article-form';
import { Layout } from '../../components/layout';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import withApollo from '../../lib/with-apollo';
import { handleValidationError } from '../../utils/graphql';

function EditorPage() {
  const router = useRouter();
  const editor = useQuery(EditorPageQuery);
  const [createArticle] = useMutation(EditorPageCreateArticleMutation);

  if (editor.loading) return null;

  return (
    <Layout userUsername={editor.data.viewer?.username}>
      <div className="editor-page">
        <ArticleForm
          initialValues={{
            input: { title: '', description: '', body: '', tagIds: [] }
          }}
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
      username
    }
  }
`;

export default withApollo(EditorPage);
