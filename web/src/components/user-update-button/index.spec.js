import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Router, { RouterContext } from 'next/router';
import { renders, canUpdate } from './index.stories';

jest.mock('next/router');

describe('UserUpdateButton', () => {
  it('does not render with insufficient access', () => {
    render(renders());
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('goes to link on click', async () => {
    render(
      <RouterContext.Provider value={Router.router}>
        {canUpdate()}
      </RouterContext.Provider>
    );
    const link = screen.getByRole('link');
    fireEvent.click(link);
    expect(Router.router.push).toHaveBeenCalledWith('/settings', '/settings', {
      shallow: undefined
    });
  });
});
