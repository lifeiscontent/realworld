import { render, screen } from '@testing-library/react';
import { ArticleUpdateButton } from '.';

describe('ArticleUpdateButton', () => {
  it('does not render with insufficient access', async () => {
    render(<ArticleUpdateButton slug="a-simple-title" />);

    expect(screen.queryByRole('link')).toBeNull();
  });

  it('renders a link with correct URL', async () => {
    render(
      <ArticleUpdateButton canUpdate={{ value: true }} slug="a-simple-title" />
    );

    const link = await screen.findByRole('link');
    expect(link).toHaveAttribute('href', '/editor/a-simple-title');
  });
});
