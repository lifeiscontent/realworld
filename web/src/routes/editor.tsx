import { gql, type TypedDocumentNode } from '@apollo/client';
import {
  type ActionFunctionArgs,
  href,
  type LoaderFunctionArgs,
  redirect,
  useActionData,
  useLoaderData,
} from 'react-router';
import { z } from 'zod';

import { evictArticleLists } from '../app/apollo';
import { apolloClientContext } from '../app/context';
import { signedInUserContext } from '../app/middleware';
import { ArticleForm } from '../features/article/ArticleForm';
import { FormPage } from '../layout/FormPage';
import { actionErrors, attempt, errorsOf, parseForm } from '../lib/forms';
import { notFound } from '../lib/responses';
import type {
  CreateArticleMutation,
  CreateArticleMutationVariables,
  EditorPageQuery,
  EditorPageQueryVariables,
  UpdateArticleMutation,
  UpdateArticleMutationVariables,
} from '../types/__generated__/graphql';

const EDITOR_PAGE_QUERY: TypedDocumentNode<
  EditorPageQuery,
  EditorPageQueryVariables
> = gql`
  query EditorPage($slug: String!) {
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

// The API validates the values. A form without tags sends no tagList.
const schema = z.object({
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.array(z.string()).default([]),
});

/**
 * GET /editor is a new article. GET /editor/:slug edits an article, and only
 * its author can edit it.
 */
export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.slug) return { article: undefined };

  // The editor needs the current text, so it always asks the API.
  const { data } = await context.get(apolloClientContext).query({
    query: EDITOR_PAGE_QUERY,
    variables: { slug: params.slug },
    fetchPolicy: 'network-only',
  });
  const article = data?.article;
  if (!article) throw notFound('This article does not exist.');
  if (article.author.username !== context.get(signedInUserContext).username) {
    throw redirect(href('/article/:slug', { slug: article.slug }));
  }

  return { article };
}

/** POST /editor creates an article, POST /editor/:slug updates it. */
export async function action({ request, params, context }: ActionFunctionArgs) {
  const { values, errors } = parseForm(schema, await request.formData(), {
    arrays: ['tagList'],
  });
  if (errors) return actionErrors(errors);
  const client = context.get(apolloClientContext);
  const slug = params.slug;

  if (slug) {
    const { result, failure } = await attempt(() =>
      client.mutate({
        mutation: UPDATE_ARTICLE_MUTATION,
        variables: { slug, article: values },
        update(cache, { data }) {
          // A new title gives a new slug. Lists have the old article.
          const updated = data?.updateArticle.slug;
          if (updated && updated !== slug) {
            cache.evict({
              id: cache.identify({ __typename: 'Article', slug }),
              broadcast: false,
            });
            evictArticleLists(cache);
          }
        },
      })
    );
    if (failure) return failure;
    return redirect(
      href('/article/:slug', { slug: result.data?.updateArticle.slug ?? slug })
    );
  }

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

export function Component() {
  const { article } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();

  // A new key resets the form when the user goes from one article to another.
  return (
    <>
      <title>
        {article ? 'Edit article | Conduit' : 'New article | Conduit'}
      </title>
      <FormPage page="editor-page" width="wide">
        <ArticleForm
          key={article?.slug ?? 'new'}
          defaultValues={article}
          errors={errorsOf(result)}
        />
      </FormPage>
    </>
  );
}
