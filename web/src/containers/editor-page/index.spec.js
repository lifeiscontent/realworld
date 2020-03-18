import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { renders, asUser } from './index.stories';
import { MockedProvider } from '@apollo/react-testing';
import Router from 'next/router';

describe('EditorPage', () => {
  beforeEach(() => {
    Router.replace.mockClear();
  });

  describe('when not logged in', () => {
    it('redirects', async () => {
      render(
        <MockedProvider {...renders.story.parameters.apolloClient}>
          {renders()}
        </MockedProvider>
      );

      await waitFor(() => {
        expect(Router.replace).toHaveBeenCalledWith(undefined, '/', {
          shallow: true
        });
      });
    });
  });

  describe('when logged in', () => {
    it('does not redirect', async () => {
      render(
        <MockedProvider mocks={asUser.story.parameters.apolloClient.mocks}>
          {asUser()}
        </MockedProvider>
      );

      await waitFor(() => {
        expect(Router.replace).not.toHaveBeenCalled();
      });
    });
  });
});
