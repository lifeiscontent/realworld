# Testing Library Best Practices

there are 3 main finder methods.

- `find*`
  - returns a promise which resolves when an element is found when the given query is matched. The promise is rejected if no element is found after a default timeout.
- `get*`
  - returns matching node(s) for a query, and throw an error if no elements match.
- `query*`
  - returns the matching node(s) for a query, and return null if no elements match. This is useful for asserting an element that is not present.

Read more at: https://testing-library.com/react
