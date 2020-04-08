import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArticleDeleteButton } from '.';

describe('ArticleDeleteButton', () => {
  let onDelete;

  beforeEach(() => {
    onDelete = jest.fn();
  });

  it('does not render with insufficient access', () => {
    render(<ArticleDeleteButton onDelete={onDelete} slug="a-simple-title" />);
    const button = screen.queryByText('Delete Article');

    expect(button).toBeNull();
  });

  it('calls onDelete on click', async () => {
    render(
      <ArticleDeleteButton
        canDelete={{ value: true }}
        onDelete={onDelete}
        slug="a-simple-title"
      />
    );
    const button = await screen.findByText('Delete Article');
    fireEvent.click(button);
    expect(onDelete).toHaveBeenCalled();
  });
});
