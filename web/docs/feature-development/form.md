# Testing Form components built with Formik


[web/src/components/article-form/index.spec.js][web/src/components/article-form/index.spec.js]

```jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// we use MockedProvider from apollo because the ArticleForm contains a Mutation for the tags input
import { MockedProvider } from '@apollo/react-testing';
import { ArticleForm } from '.';

describe('ArticleForm', () => {
  let onSubmit;

  beforeEach(() => {
    onSubmit = jest.fn();
  });

  // we want to know that the validation errors work as expected.
  it('displays errors on submit', async () => {
    // render the form
    render(
      <MockedProvider>
        <ArticleForm onSubmit={onSubmit} />
      </MockedProvider>
    );

    // gather our fields
    const submitButton = await screen.findByText('Publish Article');

    // click the submit button
    fireEvent.click(submitButton);

    // gather the errors
    const errors = await screen.findAllByText(/is a required field$/);

    // expect to see errors on the screen
    expect(errors).toHaveLength(3);
  });

  // we want to know that the form will submit successfully once we pass our validation checks
  it('calls onSubmit when valid on submit', async () => {
    // render the form
    render(
      <MockedProvider>
        <ArticleForm onSubmit={onSubmit} />
      </MockedProvider>
    );

    // gather our fields
    const title = await screen.findByLabelText(/title/i);
    const description = await screen.findByLabelText(/description/i);
    const body = await screen.findByLabelText(/body/i);
    const submitButton = await screen.findByText('Publish Article');

    fireEvent.change(title, {
      target: { value: 'How to build webapps that scale' },
    });

    fireEvent.change(description, {
      target: {
        value:
          'Web development technologies have evolved at an incredible clip over the past few years.',
      },
    });

    fireEvent.change(body, {
      target: {
        value:
          "## Introducing RealWorld.\nIt's a great solution for learning how other frameworks work.",
      },
    });

    // we need to use a `waitFor` here because Formik runs callbacks after the click event
    // waitFor internally calls the react `act` testing utility which will flush effects in the test environment
    await waitFor(async () => {
      fireEvent.click(submitButton);
    });

    // check to make sure our onSubmit handler was actually called.
    expect(onSubmit).toHaveBeenCalled();
  });
});
```
[web/src/components/article-form/index.spec.js]: https://github.com/lifeiscontent/realworld/blob/master/web/src/components/article-form/index.spec.js
