import { gql, type TypedDocumentNode } from '@apollo/client';
import { href, redirect } from 'react-router';

import { evictArticleLists } from '../app/apollo';
import { apolloClientContext } from '../app/context';
import { signedInUserContext } from '../app/middleware';
import {
  ArticleForm,
  articleFormSchema,
} from '../features/article/ArticleForm';
import { FormPage } from '../layout/FormPage';
import { actionErrors, attempt, errorsOf, parseForm } from '../lib/forms';
import { pageMeta } from '../lib/meta';
import { notFound } from '../lib/responses';
import type {
  EditArticlePageQuery,
  EditArticlePageQueryVariables,
  UpdateArticleMutation,
  UpdateArticleMutationVariables,
} from '../types/__generated__/graphql';
import type { Route } from './+types/edit-article';

const EDIT_ARTICLE_PAGE_QUERY: TypedDocumentNode<
  EditArticlePageQuery,
  EditArticlePageQueryVariables
> = gql`
  query EditArticlePage($slug: String!) {
    article(slug: $slug) {
      slug
      title
      description
      body
      tagList
      author {
        username
      }
    }
  }
`;

const UPDATE_ARTICLE_MUTATION: TypedDocumentNode<
  UpdateArticleMutation,
  UpdateArticleMutationVariables
> = gql`
  mutation UpdateArticle($slug: String!, $article: UpdateArticle!) {
    updateArticle(slug: $slug, article: $article) {
      slug
      title
      description
      body
      tagList
      updatedAt
    }
  }
`;

/** GET /editor/:slug edits an article. Only its author can edit it. */
export const meta: Route.MetaFunction = ({ error }) =>
  pageMeta('Edit article', error);

export async function clientLoader({
  params,
  context,
}: Route.ClientLoaderArgs) {
  // The editor needs the current text, so it always asks the API.
  const { data } = await context.get(apolloClientContext).query({
    query: EDIT_ARTICLE_PAGE_QUERY,
    variables: params,
    fetchPolicy: 'network-only',
  });
  const article = data?.article;
  if (!article) throw notFound('This article does not exist.');
  if (article.author.username !== context.get(signedInUserContext).username) {
    throw redirect(href('/article/:slug', params));
  }

  return { article };
}

/** POST /editor/:slug updates the article and opens it. */
export async function clientAction({
  request,
  params,
  context,
}: Route.ClientActionArgs) {
  const { values, errors } = parseForm(
    articleFormSchema,
    await request.formData(),
    { arrays: ['tagList'] }
  );
  if (errors) return actionErrors(errors);

  const client = context.get(apolloClientContext);
  const { result, failure } = await attempt(() =>
    client.mutate({
      mutation: UPDATE_ARTICLE_MUTATION,
      variables: { ...params, article: values },
      update(cache, { data }) {
        // A new title gives a new slug. Lists have the old article.
        const updated = data?.updateArticle.slug;
        if (updated && updated !== params.slug) {
          cache.evict({
            id: cache.identify({ __typename: 'Article', slug: params.slug }),
            broadcast: false,
          });
          evictArticleLists(cache);
        }
      },
    })
  );
  if (failure) return failure;
  return redirect(
    href('/article/:slug', {
      slug: result.data?.updateArticle.slug ?? params.slug,
    })
  );
}

export default function EditArticle({
  loaderData: { article },
  actionData,
}: Route.ComponentProps) {
  return (
    <FormPage page="editor-page" width="wide">
      {/* A new key resets the form for another article. */}
      <ArticleForm
        key={article.slug}
        defaultValues={article}
        errors={errorsOf(actionData)}
      />
    </FormPage>
  );
}
