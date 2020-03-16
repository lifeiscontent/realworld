# Feature Development in React

## Creating a `component`

a `component` is for the interactions of UI it should not have any ideas about the application data (this is also known as a dumb component because of how it is isolated from the rest of the world, it should not know domain-specific logic).

### Preperation

Make sure all the UI Components you need are available to you before you start on the feature.

1.  If the components you need don't exist, start by creating them in [storybook][@storybook/react].
2.  Test the behavior of those components (if any) in [jest][jest] with [@testing-library/react].

### Reference

- `component` - refers to a react component that lives in `src/components`.
- `container` - refers to a react component that lives in `src/containers`.
- `page` - refers to a react component that lives in `src/pages`.

[@apollo/react-testing]: https://www.apollographql.com/docs/react/api/react-testing
[@storybook/react]: https://storybook.js.org
[@testing-library/react]: https://testing-library.com/react
[jest]: https://jestjs.io
