import { gql, type TypedDocumentNode } from '@apollo/client';
import { href, redirect } from 'react-router';

import { evictArticleLists } from '../app/apollo';
import { apolloClientContext } from '../app/context';
import {
  ArticleForm,
  articleFormSchema,
} from '../features/article/ArticleForm';
import { FormPage } from '../layout/FormPage';
import { actionErrors, attempt, errorsOf, parseForm } from '../lib/forms';
import { pageMeta } from '../lib/meta';
import type {
  CreateArticleMutation,
  CreateArticleMutationVariables,
} from '../types/__generated__/graphql';
import type { Route } from './+types/new-article';

export const CREATE_ARTICLE_MUTATION: TypedDocumentNode<
  CreateArticleMutation,
  CreateArticleMutationVariables
> = gql`
  mutation CreateArticle($article: NewArticle!) {
    createArticle(article: $article) {
      slug
    }
  }
`;

/** POST /editor creates an article and opens it. */
export const meta: Route.MetaFunction = ({ error }) =>
  pageMeta('New article', error);

export async function clientAction({
  request,
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
      mutation: CREATE_ARTICLE_MUTATION,
      variables: { article: values },
      update: evictArticleLists,
    })
  );
  if (failure) return failure;
  const created = result.data?.createArticle.slug;
  return redirect(
    created ? href('/article/:slug', { slug: created }) : href('/')
  );
}

export default function NewArticle({ actionData }: Route.ComponentProps) {
  return (
    <FormPage page="editor-page" width="wide">
      <ArticleForm errors={errorsOf(actionData)} />
    </FormPage>
  );
}
