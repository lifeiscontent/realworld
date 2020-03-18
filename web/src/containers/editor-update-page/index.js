import React, { useEffect } from 'react';
import { ArticleForm } from '../../components/article-form';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { withLayout } from '../../hocs/with-layout';
import { handleValidationError } from '../../utils/graphql';

function EditorUpdatePage() {
  const router = useRouter();
  const editorUpdate = useQuery(EditorUpdatePageQuery, {
    variables: {
      slug: router.query.slug
    }
  });

  const [updateArticle] = useMutation(EditorUpdatePageUpdateArticleMutation);

  useEffect(() => {
    if (editorUpdate.loading || editorUpdate.data.article.canUpdate.value)
      return;
    router.replace(router.asPath, '/', { shallow: true });
  }, [editorUpdate.data, editorUpdate.loading, router]);

  if (editorUpdate.loading) return null;

  return (
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
  }
  ${EditorUpdatePageArticleFragment}
`;

export default withLayout(EditorUpdatePage);
