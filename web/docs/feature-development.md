# Feature Development in React

## Creating a `component`

a `component` is for the interactions of UI it should not have any ideas about the application data (this is also known as a dumb component because of how it is isolated from the rest of the world, it should not know domain-specific logic).

### Preperation

Make sure all the UI Components you need are available to you before you start on the feature.

1.  If the components you need don't exist, start by creating them in [storybook][storybook].
2.  Test the behavior of those components (if any) in [jest][jest].

## Creating a `container`

a `container` is for the interactions it has with GraphQL.

1.  Test the behavior of the expected outcome from the containers. e.g. does `create` get called? in Apollo you can test this using `MockedProvider` from [@apollo/react-testing][@apollo/react-testing].

## Creating a `page`

2.  Add the `container` and `component` to the page.

    1.  You might want to add a full page UI test to make sure the UI looks as you would expect.

    2.  There might be behavior you expect to happen when an external service sends you something. E.g. a router passes a query param, and that query param triggers another code path. You should mock the router, and test the code path that is executed if the router was to return the expected output. Or fallback gracefully if the router does something unexpected.

### Reference

- `component` - refers to a react component that lives in `src/components`.
- `container` - refers to a react component that lives in `src/containers`.
- `page` - refers to a react component that lives in `src/pages`.

[storybook]: https://storybook.js.org/
[jest]: https://jestjs.io/
[@apollo/react-testing]: https://www.apollographql.com/docs/react/api/react-testing/
