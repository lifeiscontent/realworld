# Feature development

The web app is a client-side app: TypeScript, Vite, React, React Router 8,
Apollo Client 4, and Storybook 10. This guide tells you where each part of a
feature goes.

## Boundaries

React Router decides when data loads and what a form does. Apollo Client
decides how the data is fetched and cached. Components only show data.

| Layer         | Folder           | Can use                                     | Must not use    |
| ------------- | ---------------- | ------------------------------------------- | --------------- |
| Route modules | `src/routes`     | loaders, actions, Apollo through `context`  | module state    |
| App layer     | `src/app`        | the router, Apollo, middleware, the session | components      |
| Components    | `src/components` | props, router components and hooks          | Apollo, loaders |
| Helpers       | `src/lib`        | plain functions                             | React, Apollo   |

### Route modules

Each route module exports the parts that React Router reads, for example
`loader`, `action`, `Component`, and `shouldRevalidate`. The root route also
exports `middleware`, `HydrateFallback`, and `ErrorBoundary`.

- A loader gets the client from `context.get(apolloClientContext)` or
  `context.get(preloadQueryContext)`. Use `preloadQuery.toPromise()` and give
  the query ref to the component. The component reads it with `useReadQuery`,
  so it updates when the cache changes.
- An action reads the form, runs a mutation, and returns an `ActionResult`
  or a redirect. Use `parseForm`, `attempt`, and `actionErrors` from
  `src/lib/forms.ts`. A component reads the messages with `errorsOf`.
- A missing record is a 404. Throw `notFound(message)` from
  `src/lib/responses.ts`. Read route parameters with `requireParam`.
- A route that only has an action exports `loader = actionOnlyLoader`, so a
  GET request to it is a 405.
- Make URLs with `paths` from `src/lib/paths.ts`. It encodes the parameters.
- Each page renders its `<title>`. React puts it in the document head.

Errors of a page show in the layout, below the navbar. The pathless route
in `src/app/router.tsx` has the error boundary for all pages.

The routes follow the RealWorld API. For example, `POST` and `DELETE` to
`/article/:slug/favorite` favorite and unfavorite an article.

### Middleware

`src/app/middleware.ts` has the middleware:

- `viewerMiddleware` loads the signed-in user once for each navigation and
  puts it in `viewerContext`.
- `requireViewer` sends guests to `/login`.
- `guestOnly` sends signed-in users to `/`.

Middleware cannot load lazily. Put a route that needs a guard below the
pathless route that has that guard in `src/app/router.tsx`.

### Revalidation

After an action, React Router loads the routes again. Some actions update
the cache themselves, and the page reads the cache, so `shouldRevalidate` in
`src/app/revalidation.ts` skips them:

- Favorite and follow use an optimistic response.
- A new comment goes into the cached list of comments.
- A deleted comment leaves the cache at once, with an optimistic response.

Actions that change an article list call `evictArticleLists` from
`src/app/apollo.ts`, so the next list loads again.

## GraphQL documents

The app uses the GraphQL Codegen setup that
[Apollo Client recommends](https://www.apollographql.com/docs/react/development-testing/graphql-codegen).
The `typescript-operations` plugin makes only types, in
`src/types/__generated__/graphql.ts`. It makes no runtime code. The file is
not in git. Vite makes it when it starts (dev, build, Storybook, and the
tests), and makes it again in dev when a document or the API schema
changes. `pnpm typecheck` makes it before it checks the types.

Write each document with `gql` next to the code that uses it, and type it
with `TypedDocumentNode`:

```ts
export const ARTICLE_PAGE_QUERY: TypedDocumentNode<
  ArticlePageQuery,
  ArticlePageQueryVariables
> = gql`
  query ArticlePage($slug: String!) {
    article(slug: $slug) {
      ...ArticleMeta_article
    }
  }
  ${ARTICLE_META_FRAGMENT}
`;
```

A component exports the fragment for the data that it shows, and the
query includes it.

## Add a feature

1. Add the operation to `api/schema.graphql` and implement it in the API.
2. Write the query or mutation in the route module.
3. Make the components. Give each component a fragment for the data that it
   shows, and write its stories.
4. Write the loader and the action, and add the route to
   `src/app/router.tsx`.
5. Write a page story that opens the route with mocked data.

## Stories

Stories use the CSF Next format from `.storybook/preview.tsx`. Each story
gets an Apollo client from `storybook-addon-apollo-client`. Give the mocked
responses in the `apolloClient` parameter:

```tsx
export const Default = meta.story({
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: { query: ArticlePageQuery, variables: { slug } },
          result: { data: { article, comments: [] } },
        },
      ],
    },
  },
});
```

The `withRouter` decorator renders each story in a memory router. The
loaders and actions get the mocked client from the router context. A page
story gives the app routes and a URL:

```tsx
const meta = preview.meta({
  title: 'Pages/Article',
  parameters: { router: { routes, url: `/article/${slug}` } },
});
```

For a signed-in story, add `beforeEach: signIn` and `viewerMock` from
`src/stories/fixtures.ts`.

Use a `play` function to test a behavior, for example the errors that an
action shows. The a11y addon checks each story, and a violation fails the
test. Component stories have the `autodocs` tag.

## Checks

| Command                                         | What it does                                              |
| ----------------------------------------------- | --------------------------------------------------------- |
| `pnpm codegen`                                  | Makes the types for the GraphQL operations                |
| `pnpm typecheck`                                | Checks the types                                          |
| `pnpm lint`                                     | Runs oxlint                                               |
| `pnpm format`                                   | Formats the code with oxfmt                               |
| `pnpm test`                                     | Runs the unit tests and the stories as browser tests      |
| `TEST_MODE=fullstack pnpm exec playwright test` | Runs the RealWorld e2e suite against the API on port 4000 |
