# Testing Form components built with Formik

```jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// in order to test the onSubmit action in the fixture, we need to use the `action` function
import { action } from '@storybook/addon-actions';
import { renders } from './index.stories'; // we're going to use the fixture from storybook
import { MockedProvider } from '@apollo/react-testing'; // we're using Apollo Client here so we need the MockedProvider

// we mock the action function, checkout the __mocks__ folder for the code.
jest.mock('@storybook/addon-actions');

describe('ArticleForm', () => {
  // we want to know that the validation errors work as expected.
  it('displays errors on submit', async () => {
    // render the fixture

    render(<MockedProvider>{renders()}</MockedProvider>);

    // grab the submitButton
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
    render(<MockedProvider>{renders()}</MockedProvider>);

    // gather our fields
    const title = await screen.findByLabelText(/title/i);
    const description = await screen.findByLabelText(/description/i);
    const body = await screen.findByLabelText(/body/i);
    const submitButton = await screen.findByText('Publish Article');

    fireEvent.change(title, {
      target: { value: 'How to build webapps that scale' }
    });

    fireEvent.change(description, {
      target: {
        value:
          'Web development technologies have evolved at an incredible clip over the past few years.'
      }
    });

    fireEvent.change(body, {
      target: {
        value:
          "## Introducing RealWorld.\nIt's a great solution for learning how other frameworks work."
      }
    });

    // we need to use a `waitFor` here because Formik runs callbacks after the click event
    // waitFor internally calls the react `act` testing utility which will flush effects in the test environment
    await waitFor(async () => {
      fireEvent.click(submitButton);
    });

    // check to make sure our onSubmit handler was actually called.
    expect(action('onSubmit')).toHaveBeenCalled();
  });
});
```
