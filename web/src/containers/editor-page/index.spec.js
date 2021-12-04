import React from 'react';
import { render, waitFor } from '@testing-library/react';
import EditorPage from '.';
import { MockedProvider } from '@apollo/client/testing';
import Router from 'next/router';
import { TagsInput } from '../tags-input';

jest.mock('next/router');

describe('EditorPage', () => {
  let mocks;

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
    beforeEach(() => {
      mocks = [
        {
          request: {
            query: EditorPage.query,
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
            query: TagsInput.query,
            variables: {},
          },
          result: {
            data: { tags: [] },
          },
        },
      ];
    });

    it('redirects', async () => {
      render(
        <MockedProvider mocks={mocks}>
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
    beforeEach(() => {
      mocks = [
        {
          request: {
            query: EditorPage.query,
            variables: {},
          },
          result: {
            data: {
              viewer: {
                canCreateArticle: {
                  value: true,
                  __typename: 'AuthorizationResult',
                },
                username: 'jamie',
                __typename: 'User',
              },
            },
          },
        },
        {
          request: {
            query: TagsInput.query,
            variables: {},
          },
          result: {
            data: {
              tags: [],
            },
          },
        },
      ];
    });

    it('does not redirect', async () => {
      render(
        <MockedProvider mocks={mocks}>
          <EditorPage />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(Router.replace).not.toHaveBeenCalled();
      });
    });
  });
});
