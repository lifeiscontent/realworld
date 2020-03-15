import { render, screen, fireEvent } from '@testing-library/react';
import { action } from '@storybook/addon-actions';
import { renders, canDelete } from './index.stories';

jest.mock('@storybook/addon-actions');

describe('ArticleDeleteButton', () => {
  it('does not render with insufficient access', () => {
    render(renders());
    const button = screen.queryByText('Delete Article');

    expect(button).toBeNull();
  });

  it('calls onDelete on click', async () => {
    render(canDelete());
    const button = await screen.findByText('Delete Article');
    fireEvent.click(button);
    expect(action('onDelete')).toHaveBeenCalled();
  });
});
