import { render, screen } from '@testing-library/react';
import { UserUpdateButton } from '.';

describe('UserUpdateButton', () => {
  it('does not render with insufficient access', () => {
    render(<UserUpdateButton />);

    expect(screen.queryByRole('link')).toBeNull();
  });

  it('goes to link on click', async () => {
    render(<UserUpdateButton canUpdate={{ value: true }} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/settings');
  });
});
