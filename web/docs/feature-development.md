# Feature development

The web app is a client-side app: TypeScript, Vite, React, React Router 8
in framework mode, Apollo Client 4, and Storybook 10. It uses SPA mode
(`ssr: false` in `react-router.config.ts`), so the build makes static files
and the routes use client exports. This guide tells you where each part of a
feature goes.

## Boundaries

React Router decides when data loads and what a form does. Apollo Client
decides how the data is fetched and cached. Components only show data.

| Layer         | Folder         | Can use                                       | Must not use        |
| ------------- | -------------- | --------------------------------------------- | ------------------- |
| Route modules | `src/routes`   | loaders, actions, Apollo through `context`    | module state        |
| App layer     | `src/app`      | Apollo, middleware, the session               | components          |
| Features      | `src/features` | fragments, `ui`, forms and fetchers to routes | Apollo, loaders     |
| Layout        | `src/layout`   | `ui`, router links                            | Apollo, domain data |
| UI            | `src/ui`       | props, router links                           | domain types, forms |
| Helpers       | `src/lib`      | plain functions                               | React, Apollo       |

A feature component shows one domain object, for example an article, a
comment, or a profile. It has the fragment for its data, and it can post to
the route that changes that data. A UI component knows nothing about the
domain: `Button`, `TextField`, `Tabs`, `Banner`, `Avatar`, `Pagination`,
`ErrorMessages`, and `TagList`. A layout puts features on a page, for
example `FormPage` for the account and editor forms.

### Route modules

`src/routes.ts` has the routes, and `src/root.tsx` is the root route. Each
route module exports the parts that React Router reads, for example
`clientLoader`, `clientAction`, the page component as the default export,
and `shouldRevalidate`. The root route also exports `Layout`,
`clientMiddleware`, `HydrateFallback`, and `ErrorBoundary`.

React Router makes the types of each route in `./+types/<route>`. Use
`Route.ClientLoaderArgs`, `Route.ClientActionArgs`, and `Route.ComponentProps`.
The page component gets `loaderData` and `actionData` as props, and `params`
has the types of the path. When the params have the same names as the
variables of an operation, give `params` as the `variables`.

- A loader gets the client from `context.get(apolloClientContext)` or
  `context.get(preloadQueryContext)`. Use `preloadQuery.toPromise()` and give
  the query ref to the component. The component reads it with `useReadQuery`,
  so it updates when the cache changes.
- An action reads the form, runs a mutation, and returns an `ActionResult`
  or a redirect. Use `parseForm`, `attempt`, and `actionErrors` from
  `src/lib/forms.ts`. A component reads the messages with `errorsOf`.
- A missing record is a 404. Throw `notFound(message)` from
  `src/lib/responses.ts`.
- A route that only has an action exports `clientLoader = actionOnlyLoader`,
  so a GET request to it is a 405.
- Make URLs with React Router's `href`, for example
  `href('/article/:slug', { slug })`. It encodes the params. React Router
  registers the paths of `src/routes.ts`, so a wrong path or a missing param
  is a type error.
- Each page renders its `<title>`. React puts it in the document head.

Errors of a page show in the layout, below the navbar. The pages layout
(`src/routes/pages.tsx`) has the error boundary for all pages.

The routes follow the RealWorld API. For example, `POST` and `DELETE` to
`/article/:slug/favorite` favorite and unfavorite an article.

### Middleware and layouts

`src/app/middleware.ts` has the middleware:

- `viewerMiddleware` loads the signed-in user once for each navigation and
  puts it in `viewerContext`. The value is null for a guest.
- `requireViewer` sends guests to `/login`. For a user, it sets
  `signedInUserContext`, which is never null.
- `guestOnly` sends signed-in users to `/`.

Two layout routes use the guards in their `clientMiddleware`:

- `src/routes/signed-in.tsx` uses `requireViewer`. A loader or an action
  below it reads the user with `context.get(signedInUserContext)`, and a
  page reads it with `useSignedInViewer()`. Neither value can be null.
- `src/routes/guest.tsx` uses `guestOnly`, and puts the sign-in and sign-up
  forms in the auth page layout.

To add a page for signed-in users, add its route in the `signed-in.tsx`
layout in `src/routes.ts`.

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
4. Write the `clientLoader` and the `clientAction`, and add the route to
   `src/routes.ts`.
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
          request: { query: ARTICLE_PAGE_QUERY, variables: { slug } },
          result: { data: { article, comments: [] } },
        },
      ],
    },
  },
});
```

The `withRouter` decorator renders each story in a test router from
React Router's `createRoutesStub`. The loaders, actions, and middleware get
the mocked client from the router context. A page story sets `app: true`.
Then the router has the routes of `src/routes.ts` with the real route
modules, and opens the URL:

```tsx
const meta = preview.meta({
  title: 'Pages/Article',
  parameters: { router: { app: true, url: `/article/${slug}` } },
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
