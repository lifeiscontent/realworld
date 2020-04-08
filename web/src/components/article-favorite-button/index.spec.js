import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArticleFavoriteButton } from '.';

describe('ArticleFavoriteButton', () => {
  let onFavorite;
  let onUnfavorite;

  beforeEach(() => {
    onFavorite = jest.fn();
    onUnfavorite = jest.fn();
  });

  it('is disabled with insufficient access', async () => {
    render(
      <ArticleFavoriteButton
        onFavorite={onFavorite}
        onUnfavorite={onUnfavorite}
        slug="a-simple-title"
      />
    );

    const button = await screen.findByText('Favorite Article (0)');
    expect(button).toBeDisabled();
  });

  it('calls onFavorite when clicked', async () => {
    render(
      <ArticleFavoriteButton
        onFavorite={onFavorite}
        onUnfavorite={onUnfavorite}
        slug="a-simple-title"
        canFavorite={{ value: true }}
      />
    );
    const button = await screen.findByText('Favorite Article (0)');

    fireEvent.click(button);
    expect(onFavorite).toHaveBeenCalled();
  });

  it('calls onUnfavorite when clicked', async () => {
    render(
      <ArticleFavoriteButton
        canUnfavorite={{ value: true }}
        favoritesCount={1}
        onFavorite={onFavorite}
        onUnfavorite={onUnfavorite}
        slug="a-simple-title"
        viewerDidFavorite={true}
      />
    );

    const button = await screen.findByText('Unfavorite Article (1)');

    fireEvent.click(button);
    expect(onUnfavorite).toHaveBeenCalled();
  });
});
