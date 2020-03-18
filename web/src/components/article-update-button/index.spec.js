import { render, fireEvent, screen } from '@testing-library/react';
import Router from 'next/router';
import { renders, canUpdate } from './index.stories';

jest.mock('next/router');

describe('ArticleUpdateButton', () => {
  it('does not render with insufficient access', async () => {
    const { container } = render(renders());
    expect(container.children).toHaveLength(0);
  });

  it('goes to link on click', () => {
    render(canUpdate());

    const link = screen.getByRole('link');
    fireEvent.click(link);
    expect(Router.push).toHaveBeenCalledWith(
      '/editor/[slug]',
      '/editor/a-simple-title',
      { shallow: undefined }
    );
  });
});
