### What is a Viewer in GraphQL

A Viewer is the idea of a type of user who is viewing your site / API.

- is it a guest?
- is it a user?
- is it an admin?

depending on the context of who is looking (viewing) at your site / API, you might show a different experience, and this is what `viewer` means in GraphQL.

depending on the complexity of your app, you might have one or many types of users, and you can deal with the varying types of users by creating a union type.

e.g.

```graphql
union Viewer = Guest | User | Admin
```

this allows us to distinguish the type of data we are getting back from the API, e.g. if the type is a user, it might have different fields than an admin user.

the way you'd distinguish which type you get back from the union would look something like this:

```graphql
query ViewerQuery {
  viewer {
    __typename
    ... on User {
      username
      isAdmin
    }
    ... on Admin {
      isAdmin
    }
  }
}
```

What is happening here is we query data from the `viewer` field, for every type in GraphQL it has a `__typename` field to know which type the data is. in the case the `Viewer` is a `User`, the `__typename` would be `User` so we would return the `username` and `isAdmin` would be `false` in the response.

In the case that the viewer was an `Admin`, we would not see the `username`, but we would see `isAdmin` return `true`.
