import React from 'react';
import { ArticleForm } from '../../components/article-form';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { handleValidationError } from '../utils/graphql';

export function UpdateArticleForm(props) {
  const router = useRouter();
  const editorUpdate = useQuery(UpdateArticleFormQuery, {
    variables: {
      slug: props.articleSlug
    }
  });
  const [updateArticle] = useMutation(UpdateArticleFormUpdateArticleMutation);

  if (editorUpdate.loading) return null;

  return (
    <ArticleForm
      initialValues={{
        slug: editorUpdate.data.article.slug ?? '',
        input: {
          title: editorUpdate.data.article.title ?? '',
          description: editorUpdate.data.article.description ?? '',
          body: editorUpdate.data.article.body ?? '',
          tagIds: (editorUpdate.data.article.tags ?? []).map(tag => tag.id)
        }
      }}
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
    />
  );
}

UpdateArticleForm.fragments = {
  article: gql`
    fragment UpdateArticleFormArticleFragment on Article {
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

const UpdateArticleFormUpdateArticleMutation = gql`
  mutation UpdateArticleFormUpdateArticleMutation(
    $slug: ID!
    $input: UpdateArticleInput!
  ) {
    updateArticle(slug: $slug, input: $input) {
      article {
        ...UpdateArticleFormArticleFragment
      }
    }
  }
  ${UpdateArticleForm.fragments.article}
`;

const UpdateArticleFormQuery = gql`
  query UpdateArticleFormQuery($slug: ID!) {
    article: articleBySlug(slug: $slug) {
      ...UpdateArticleFormArticleFragment
    }
  }
  ${UpdateArticleForm.fragments.article}
`;
