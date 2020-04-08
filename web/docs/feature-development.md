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

### Index

1. [Using Testing Library][web/docs/feature-development/testing-library.md]
1. [Creating A UI Component][web/docs/feature-development/ui.md]
2. [Testing A Container][web/docs/feature-development/container.md]
3. [Testing A Form][web/docs/feature-development/form.md]
4. [Testing A Page][web/docs/feature-development/page.md]

[web/docs/feature-development/testing-library.md]: https://github.com/lifeiscontent/realworld/blob/master/web/docs/feature-development/testing-library.md
[web/docs/feature-development/container.md]: https://github.com/lifeiscontent/realworld/blob/master/web/docs/feature-development/container.md
[web/docs/feature-development/form.md]: https://github.com/lifeiscontent/realworld/blob/master/web/docs/feature-development/form.md
[web/docs/feature-development/page.md]: https://github.com/lifeiscontent/realworld/blob/master/web/docs/feature-development/page.md
[web/docs/feature-development/ui.md]: https://github.com/lifeiscontent/realworld/blob/master/web/docs/feature-development/ui.md
[@apollo/react-testing]: https://www.apollographql.com/docs/react/api/react-testing
[@storybook/react]: https://storybook.js.org
[@testing-library/react]: https://testing-library.com/react
[jest]: https://jestjs.io
