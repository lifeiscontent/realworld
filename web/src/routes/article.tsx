import { gql, type TypedDocumentNode } from '@apollo/client';
import { useReadQuery } from '@apollo/client/react';
import {
  type ActionFunctionArgs,
  href,
  Link,
  type LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from 'react-router';

import { evictArticleLists } from '../app/apollo';
import { apolloClientContext, preloadQueryContext } from '../app/context';
import { viewerContext } from '../app/middleware';
import { useViewer } from '../app/viewer';
import {
  ARTICLE_ACTIONS_FRAGMENT,
  ArticleAuthorActions,
  ArticleReaderActions,
} from '../features/article/ArticleActions';
import {
  ARTICLE_CONTENT_FRAGMENT,
  ArticleContent,
} from '../features/article/ArticleContent';
import {
  ARTICLE_META_FRAGMENT,
  ArticleMeta,
} from '../features/article/ArticleMeta';
import {
  COMMENT_CARD_FRAGMENT,
  CommentCard,
} from '../features/comment/CommentCard';
import { CommentForm } from '../features/comment/CommentForm';
import { attempt } from '../lib/forms';
import { requireParam } from '../lib/params';
import { methodNotAllowed, notFound } from '../lib/responses';
import type {
  ArticlePageQuery,
  ArticlePageQueryVariables,
  DeleteArticleMutation,
  DeleteArticleMutationVariables,
} from '../types/__generated__/graphql';
import { Banner } from '../ui/Banner';

export { shouldRevalidate } from '../app/revalidation';

export const ARTICLE_PAGE_QUERY: TypedDocumentNode<
  ArticlePageQuery,
  ArticlePageQueryVariables
> = gql`
  query ArticlePage($slug: String!) {
    article(slug: $slug) {
      slug
      title
      ...ArticleMeta_article
      ...ArticleActions_article
      ...ArticleContent_article
    }
    comments(slug: $slug) {
      ...CommentCard_comment
    }
  }
  ${ARTICLE_CONTENT_FRAGMENT}
  ${ARTICLE_META_FRAGMENT}
  ${ARTICLE_ACTIONS_FRAGMENT}
  ${COMMENT_CARD_FRAGMENT}
`;

const DELETE_ARTICLE_MUTATION: TypedDocumentNode<
  DeleteArticleMutation,
  DeleteArticleMutationVariables
> = gql`
  mutation DeleteArticle($slug: String!) {
    deleteArticle(slug: $slug)
  }
`;

/** GET /article/:slug. An unknown slug is a 404. */
export async function loader({ params, context }: LoaderFunctionArgs) {
  const slug = requireParam(params, 'slug');
  const preloadQuery = context.get(preloadQueryContext);
  const articleRef = await preloadQuery.toPromise(
    preloadQuery(ARTICLE_PAGE_QUERY, {
      variables: { slug },
      fetchPolicy: 'cache-and-network',
    })
  );

  const page = context
    .get(apolloClientContext)
    .readQuery({ query: ARTICLE_PAGE_QUERY, variables: { slug } });
  if (!page?.article) throw notFound('This article does not exist.');

  return { articleRef };
}

/** DELETE /article/:slug deletes the article and opens the home page. */
export async function action({ request, params, context }: ActionFunctionArgs) {
  if (request.method !== 'DELETE') throw methodNotAllowed();
  if (!context.get(viewerContext)) throw redirect(href('/login'));

  const slug = requireParam(params, 'slug');
  const client = context.get(apolloClientContext);
  const { failure } = await attempt(() =>
    client.mutate({
      mutation: DELETE_ARTICLE_MUTATION,
      variables: { slug },
      update(cache) {
        // The article page is still open, so it must not update now.
        cache.evict({
          id: cache.identify({ __typename: 'Article', slug }),
          broadcast: false,
        });
        evictArticleLists(cache);
      },
    })
  );
  if (failure) return failure;

  return redirect(href('/'));
}

export function Component() {
  const { articleRef } = useLoaderData<typeof loader>();
  const { data, dataState } = useReadQuery(articleRef);
  const { viewer } = useViewer();

  if (dataState !== 'complete' || !data.article) return null;
  const { article, comments } = data;

  const isAuthor = viewer?.username === article.author.username;
  const meta = (
    <ArticleMeta article={article}>
      {isAuthor ? (
        <ArticleAuthorActions slug={article.slug} />
      ) : (
        <ArticleReaderActions article={article} />
      )}
    </ArticleMeta>
  );

  return (
    <div className="article-page">
      <title>{`${article.title} | Conduit`}</title>
      <Banner>
        <h1>{article.title}</h1>
        {meta}
      </Banner>
      <div className="container page">
        <ArticleContent article={article} />
        <hr />
        <div className="article-actions">{meta}</div>
        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {viewer ? (
              <CommentForm slug={article.slug} viewer={viewer} />
            ) : (
              <p>
                <Link to={href('/login')}>Sign in</Link> or{' '}
                <Link to={href('/register')}>sign up</Link> to add comments on
                this article.
              </p>
            )}
            {(comments ?? []).map(comment => (
              <CommentCard
                key={comment.id}
                slug={article.slug}
                comment={comment}
                canDelete={viewer?.username === comment.author.username}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
