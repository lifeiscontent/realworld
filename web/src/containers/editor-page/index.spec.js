import React from 'react';
import { render, waitFor } from '@testing-library/react';
import EditorPage, { EditorPageQuery } from '.';
import { MockedProvider } from '@apollo/react-testing';
import { LayoutQuery } from '../layout';
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
