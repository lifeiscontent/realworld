import React from 'react';
import { render, waitFor } from '@testing-library/react';
import EditorPage from '.';
import { MockedProvider } from '@apollo/client/testing';
import Router from 'next/router';

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

  describe('when not logged in', () => {
    it('redirects', async () => {
      render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: EditorPage.query,
                variables: {},
              },
              result: {
                data: {
                  canCreateArticle: {
                    value: false,
                    __typename: 'AuthorizationResult',
                  },
                  viewer: null,
                },
              },
            },
          ]}
        >
          <EditorPage />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(Router.replace).toHaveBeenCalledWith('/editor', '/', {
          shallow: true,
        });
      });
    });
  });

  describe('when logged in', () => {
    it('does not redirect', async () => {
      render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: EditorPage.query,
                variables: {},
              },
              result: {
                data: {
                  canCreateArticle: {
                    value: true,
                    __typename: 'AuthorizationResult',
                  },
                  viewer: {
                    username: 'jamie',
                    __typename: 'User',
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
