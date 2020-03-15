import { render, screen, fireEvent } from '@testing-library/react';
import { action } from '@storybook/addon-actions';
import { renders, canFavorite, canUnfavorite } from './index.stories';

jest.mock('@storybook/addon-actions');

describe('ArticleFavoriteButton', () => {
  it('is disabled with insufficient access', async () => {
    render(renders());

    const button = await screen.findByText('Favorite Article (0)');
    expect(button).toHaveAttribute('disabled');
  });

  it('calls onFavorite when clicked', async () => {
    render(canFavorite());
    const button = await screen.findByText('Favorite Article (0)');

    fireEvent.click(button);
    expect(action('onFavorite')).toHaveBeenCalled();
  });

  it('calls onUnfavorite when clicked', async () => {
    render(canUnfavorite());

    const button = await screen.findByText('Unfavorite Article (1)');

    fireEvent.click(button);
    expect(action('onUnfavorite')).toHaveBeenCalled();
  });
});
