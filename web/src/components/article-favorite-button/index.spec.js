import { render, fireEvent, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { action } from '@storybook/addon-actions';
import { renders, canFavorite, canUnfavorite } from './index.stories';

jest.mock('@storybook/addon-actions');

describe('ArticleDeleteButton', () => {
  it('is disabled with insufficient access', async () => {
    const { getByRole } = render(renders());
    await wait(() => {
      const button = getByRole('button');
      expect(button).toHaveAttribute('disabled');
    });
  });

  it('calls onFavorite when clicked', async () => {
    const { getByRole } = render(canFavorite());
    await wait(() => {
      const button = getByRole('button');
      fireEvent.click(button);
      expect(action('onFavorite')).toHaveBeenCalled();
    });
  });

  it('calls onUnfavorite when clicked', async () => {
    const { getByRole } = render(canUnfavorite());

    await wait(() => {
      const button = getByRole('button');
      fireEvent.click(button);
      expect(action('onUnfavorite')).toHaveBeenCalled();
    });
  });
});
