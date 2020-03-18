import { render, fireEvent, screen } from '@testing-library/react';
import Router from 'next/router';
import { renders, canUpdate } from './index.stories';

jest.mock('next/router');

describe('UserUpdateButton', () => {
  it('does not render with insufficient access', () => {
    render(renders());
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('goes to link on click', async () => {
    render(canUpdate());
    const link = screen.getByRole('link');
    fireEvent.click(link);
    expect(Router.push).toHaveBeenCalledWith('/settings', '/settings', {
      shallow: undefined
    });
  });
});
