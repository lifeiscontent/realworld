import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Router, { RouterContext } from 'next/router';
import { renders, canUpdate } from './index.stories';

jest.mock('next/router');

describe('UserUpdateButton', () => {
  it('does not render with insufficient access', async () => {
    const { container } = render(renders());
    expect(container.children).toHaveLength(0);
  });

  it('goes to link on click', async () => {
    const { getByRole } = render(
      <RouterContext.Provider value={Router.router}>
        {canUpdate()}
      </RouterContext.Provider>
    );
    await wait(() => {
      const link = getByRole('link');
      fireEvent.click(link);
      expect(Router.router.push).toHaveBeenCalledWith(
        '/settings',
        '/settings',
        { shallow: undefined }
      );
    });
  });
});
