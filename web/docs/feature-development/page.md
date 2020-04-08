## Creating a `page`

2.  Add the `containers` and `components` to the page.

    1.  You might want to add a full page UI test to make sure the UI looks as you would expect.

    2.  For behavior, when a service sends you something. E.g. a router passes a query param, and that query param triggers another code path. You should mock the router, and test the code path that is executed if the router was to return the expected output. Or fallback gracefully if the router does something unexpected.

Let's write a test for the EditorPage

```js
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import EditorPage, { EditorPageQuery } from '.';
// we use MockedProvider from Apollo because we have some data we need to fetch
import { MockedProvider } from '@apollo/react-testing';
import { LayoutQuery } from '../layout';
import Router from 'next/router';

// we mock next/router look at the __mocks__ folder for the code.
jest.mock('next/router');

describe('EditorPage', () => {
  beforeEach(() => {
    Router.replace = jest.fn();
    Router.pathname = '/editor';
    Router.asPath = '/editor';
  });

  afterEach(() => {
    Router.replace = jest.fn();
    Router.pathname = '/';
    Router.asPath = '/';
  });

  // we want to test that our page component actually redirects
  // when an unauthorized user comes to view the page
  describe('when not logged in', () => {
    it('redirects', async () => {
      // render the UI with some mocked data
      render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: LayoutQuery,
                variables: {},
              },
              result: {
                data: {
                  viewer: null,
                },
              },
            },
            {
              request: {
                query: EditorPageQuery,
                variables: {},
              },
              result: {
                data: {
                  canCreateArticle: {
                    value: false,
                    __typename: 'AuthorizationResult',
                  },
                },
              },
            },
          ]}
        >
          <EditorPage />
        </MockedProvider>
      );

      // since this this happens in an effect, we need to use `waitFor`.
      await waitFor(() => {
        // test that the router was called with the right arguments
        expect(Router.replace).toHaveBeenCalledWith('/editor', '/', {
          shallow: true,
        });
      });
    });
  });

  describe('when logged in', () => {
    it('does not redirect', async () => {
      // render the UI with some mocked data
      render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: LayoutQuery,
                variables: {},
              },
              result: {
                data: {
                  viewer: {
                    username: 'jamie',
                    __typename: 'User',
                  },
                },
              },
            },
            {
              request: {
                query: EditorPageQuery,
                variables: {},
              },
              result: {
                data: {
                  canCreateArticle: {
                    value: true,
                    __typename: 'AuthorizationResult',
                  },
                },
              },
            },
          ]}
        >
          <EditorPage />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(Router.replace).not.toHaveBeenCalled();
      });
    });
  });
});
```
